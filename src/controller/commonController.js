const { Fresh, Frozen, Recipe, RecipeLike } = require("../model");
const { Op } = require("sequelize");
const { myPageService, userService, recipeService } = require("../service");

let today = new Date();
let date = new Date(); // 오늘+2일 후
date.setDate(date.getDate() + 2);
let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정
let fridgeList; // 냉장고에서 선택한 식재료 list(join한 문자열 상태) 전역변수로 받음, renderRecipe [2]-1-2에서 사용

const commonController = {
  renderLogin(req, res, next) {
    res.render("user/signIn");
  },

  renderSignUp(req, res, next) {
    res.render("user/signUp");
  },

  async renderMain(req, res, next) {
    try {
      // render시 필요한 key-value's
      // [1] 로그인 여부 T/F - isLogin
      // [2] 유통기한 임박(2일 이내) 식재료 수 - fresh_count
      // [3] 유통기한 지난 식재료 수 - exp_count (식재료 목록도 필요)
      const popular_recipes = await recipeService.findPopularRecipes();
      if (req.session.user) {
        // 임박 식재료 개수
        let fresh_count = await Fresh.findAndCountAll({
          where: {
            fresh_expire: {
              [Op.gte]: today,
              [Op.lte]: date,
            },
            user_user_id: req.session.user,
          },
        });
        // 유통기한 지난 식재료 개수 & list
        let exp_list = await Fresh.findAndCountAll({
          where: {
            fresh_expire: {
              [Op.lt]: today,
            },
            user_user_id: req.session.user,
          },
        });
        exp_list_arr = exp_list.rows; //global 배열에 유통기한 지난 식재료 목록 담음

        const user = await userService.getUser(req.session.user);
        req.session.user_name = user.user_name;
        req.session.fresh_count = fresh_count.count;
        req.session.exp_count = exp_list.count;
        const { social_login, user_name, exp_count } = req.session;

        res.render("main/main", {
          isLogin: true,
          social_login,
          user_name,
          fresh_count,
          exp_count,
          popular_recipes,
        });
      } else {
        res.render("main/main", {
          isLogin: false,
          social_login: false,
          user_name: false,
          fresh_count: false,
          exp_count: false,
          popular_recipes,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // 유통기한 지난 식재료 삭제 alert
  // renderMain에서 담은 유통기한 지난 식재료 global 배열 exp_list_arr의 요소들 DB에서 차례로 삭제
  async deleteDeleteAlert(req, res) {
    let list = [];
    for (el of exp_list_arr) {
      list.push(el.fresh_name);

      await Fresh.destroy({
        where: {
          user_user_id: req.session.user,
          fresh_name: el.fresh_name,
        },
      });
    }
    console.log("delete list : ", list);
    res.send({ list: list });
  },

  async renderMyFridge(req, res, next) {
    const { social_login, user_name } = req.session;
    let fresh_result = await Fresh.findAndCountAll({
      where: { user_user_id: req.session.user },
      order: [["fresh_expire", "ASC"]],
    });

    let frozen_result = await Frozen.findAndCountAll({
      where: { user_user_id: req.session.user },
      order: [["frozen_date", "ASC"]],
    });
    // console.log("list :", fresh_result.count, frozen_result.count );
    if (req.cookies.EMPTY_ALERT == 1) {
      //로그인 O & 오늘안봄클릭 O
      res.render("fridge/myFridge", {
        isLogin: true,
        social_login,
        user_name,
        fresh_list: fresh_result.rows,
        frozen_list: frozen_result.rows,
        empty_alert: true,
      });
    } else {
      res.render("fridge/myFridge", {
        //로그인 O & 오늘안봄클릭 X
        isLogin: true,
        social_login,
        user_name,
        fresh_list: fresh_result.rows,
        frozen_list: frozen_result.rows,
        empty_alert: false,
      });
    }
  },

  async renderRecipe(req, res) {
    // 좋아요한 레시피를 구분하기 위해서(로그인시, 비로그인시 둘다 필요)
    let likeUser = await RecipeLike.findAll({
      raw: true,
      attributes: [
        ["user_user_id", "userId"],
        ["recipe_recipe_id", "recipeId"],
        ["like_id", "likeId"],
      ],
    });

    // [1] 로그인 했을 때
    if (req.session.user) {
      // [1]-1 fresh 테이블과 frozen 테이블의 모든 재료를 findAll로 가져온다.
      let freRes = await Fresh.findAll({
        raw: true,
        attributes: [
          ["fresh_name", "name"],
          ["fresh_range", "range"],
        ],
        where: { user_user_id: req.session.user },
      });
      let froRes = await Frozen.findAll({
        raw: true,
        attributes: [
          ["frozen_name", "name"],
          ["frozen_range", "range"],
        ],
        where: { user_user_id: req.session.user },
      });

      // [1]-2 fresh, frozen 테이블에서 검색한 결과를 합쳐서 ingdRes에 넣는다.
      let ingdRes = [];

      freRes.forEach((item) => {
        ingdRes.push(item);
      });
      froRes.forEach((item) => {
        ingdRes.push(item);
      });

      let ingdName = []; // 식재료
      let ingdRange = []; // 수량

      // [1]-3 식재료 이름, 수량을 각각 ingdName과 ingdRange에 집어넣기
      for (var i = 0; i < ingdRes.length; i++) {
        ingdName.push(ingdRes[i].name + "");
        ingdRange.push(ingdRes[i].range);
      }
      // [1]-4 정확하게 일치하는 재료를 찾기 위해서 ingName을 문자열로
      let ingdNameStr = "," + ingdName.join(",|,") + ",";

      // [1]-5 더 광범위한 재료 포함 할 때 ex 파 검색 => 쪽파, 대파, 양파 같이
      let bigIngdNameStr = ingdNameStr.replace(/,/g, "");

      // 식재료가 있을 때 일치하는 식재료가 있으면 보여준다.
      let where = {}; // 레시피에서 검색할 때 사용할 where 절
      // [1]-6 식재료가 있을 때
      if (ingdRes.length > 0) {
        let result;
        let recipes;
        // [1]-6-1 검색어로 렌더
        if (req.query.keyword) {
          recipes = await Recipe.findAll({
            raw: true,
            where: { ["recipe_ingd"]: { [Op.regexp]: req.query.keyword } },
          });
        }
        // [1]-6-2 나의 냉장고에서 선택한 식재료로 렌더, 영은
        if (req.query.fridge) {
          recipes = await Recipe.findAll({
            raw: true,
            where: { ["recipe_ingd"]: { [Op.regexp]: "," + fridgeList + "," } },
          });
        }
        // [1]-6-3 빠른한끼 태그로 렌더
        if (req.query.tag == "빠른한끼") {
          recipes = await Recipe.findAll({
            raw: true,
            where: { ["recipe_ingd"]: { [Op.regexp]: ingdNameStr } },
            order: [["recipe_time", "ASC"]],
            limit: 45,
          });
        }
        // [1]-6-4 식재료일치 태그로 렌더
        if (req.query.tag === "식재료일치") {
          recipes = await Recipe.findAll({
            raw: true,
            where: { ["recipe_ingd"]: { [Op.regexp]: ingdNameStr } },
          });
        }
        // [1]-6-5 기본 렌더
        if (
          req.query.tag != "빠른한끼" &&
          req.query.tag != "식재료일치" &&
          !req.query.keyword &&
          !req.query.fridge
        ) {
          // 식재료랑 비슷하게 일치하는 레시피가 있을 때,
          where["recipe_ingd"] = { [Op.regexp]: bigIngdNameStr };
          if (req.query.tag) {
            where["recipe_tag"] = req.query.tag;
          }
          recipes = await Recipe.findAll({
            raw: true, // dataValues만 가져오기
            where,
          });
        }
        result = { data: recipes, dataLike: likeUser };

        // [1]-6 식재료 있을 때 프론트 단에서 사용할 나의 재료 이름과 수량
        let ingdResult = [];
        for (var i = 0; i < recipes.length; i++) {
          ingdResult.push(recipes[i].recipe_ingd);
        }

        // [1]-7 result 안에 ejs에서 사용할 변수들
        result["ingdName"] = ingdName;
        result["ingdRange"] = ingdRange;
        result["ingdResult"] = ingdResult;
        result["isLogin"] = true;
        result["social_login"] = req.session.social_login;
        result["user_id"] = req.session.user;
        result["user_name"] = req.session.user_name;

        // [1]-8 기본 결과는 유사 재료 레시피
        if (req.query.tag) {
          result["tag"] = req.query.tag;
        } else {
          result["tag"] = "유사 재료 레시피";
        }
        console.log("식재료 냉장고 결과", result.ingdName);

        res.render("recipe/recipe", result);
      } else {
        // [1]-9 로그인 했는데 식재료가 없을 때(냉장고 빈 것 포함)
        let result;
        let recipes;
        // [1]-9-1 로그인 시 식재료 없을 때 기본 렌더
        if (req.query.tag != "빠른한끼" && !req.query.keyword) {
          let where = {};
          if (req.query.tag) {
            where["recipe_tag"] = req.query.tag;
          } else {
            where["recipe_tag"] = null;
          }
          recipes = await Recipe.findAll({
            raw: true, // dataValues만 가져오기
            where,
          });
        }
        // [1]-9-2 로그인 시 식재료 없을 때 빠른 한끼 렌더
        if (req.query.tag == "빠른한끼") {
          recipes = await Recipe.findAll({
            raw: true,
            order: [["recipe_time", "ASC"]],
            limit: 45,
          });
        }
        // [1]-9-3 로그인 시 식재료 없을 때 검색어로 렌더
        if (req.query.keyword) {
          console.log("로그인, 식재료 없는 검색어 렌더");
          recipes = await Recipe.findAll({
            raw: true,
            where: { ["recipe_ingd"]: { [Op.regexp]: req.query.keyword } },
          });
        }
        result = { data: recipes, dataLike: likeUser };
        result["isLogin"] = true;
        result["social_login"] = req.session.social_login;
        result["user_id"] = req.session.user;
        result["user_name"] = req.session.user_name;

        if (req.query.tag) {
          result["tag"] = req.query.tag;
        } else {
          result["tag"] = "추천레시피";
        }
        res.render("recipe/recipe_non", result);
      }
    } else {
      // [2] 비로그인 시
      // [2]-1 비로그인 시 기본 렌더
      let result;
      let recipes;
      if (
        req.query.tag != "빠른한끼" &&
        !req.query.keyword &&
        req.query.tag != "겨울간식"
      ) {
        let where = {};

        if (req.query.tag) {
          where["recipe_tag"] = req.query.tag;
        } else {
          where["recipe_tag"] = null;
        }

        recipes = await Recipe.findAll({
          raw: true, // dataValues만 가져오기
          where,
        });
      }

      // [2]-2 비로그인 시 빠른 한끼 렌더
      if (req.query.tag == "빠른한끼") {
        recipes = await Recipe.findAll({
          raw: true,
          order: [["recipe_time", "ASC"]],
          limit: 45,
        });
      }
      // [2]-3 비로그인 시 겨울간식 렌더
      if (req.query.tag == "겨울간식") {
        recipes = await Recipe.findAll({
          raw: true,
          where: { recipe_tag: req.query.tag },
        });
      }
      // [2]-4 비로그인 시 검색어로 렌더
      if (req.query.keyword) {
        recipes = await Recipe.findAll({
          raw: true,
          where: { ["recipe_ingd"]: { [Op.regexp]: req.query.keyword } },
        });
      }
      result = { data: recipes, dataLike: likeUser };
      result["isLogin"] = false;
      result["social_login"] = false;
      result["user_name"] = false;

      if (req.query.tag) {
        result["tag"] = req.query.tag;
      } else {
        result["tag"] = "추천레시피";
      }
      res.render("recipe/recipe_non", result);
    }
  },

  async getFromFridge(req, res) {
    fridgeList = req.query.fridgeList;
    res.send(true);
  },

  async renderMyPage(req, res, next) {
    try {
      const { user, user_name, social_login } = req.session;
      const fresh_ingredients_categories = await myPageService.getFreshIngds(
        user
      );
      const { cooked_dishes, cooked_dishes_categories } =
        await myPageService.getCookedDishes(user);
      const recently_viewed_recipes = await myPageService.getRecipes(user);

      res.render("user/myPage", {
        isLogin: true,
        social_login,
        user_name,
        fresh_ingredients_categories,
        cooked_dishes_categories,
        cooked_dishes,
        recently_viewed_recipes,
      });
    } catch (error) {
      next(error);
    }
  },

  async renderWishList(req, res, next) {
    try {
      const { user, user_name, social_login } = req.session;
      const wishlist = await myPageService.getWishList(user);
      res.render("user/wishList", {
        isLogin: true,
        social_login,
        user_name,
        wishlist,
      });
    } catch (error) {
      next(error);
    }
  },

  async renderCheckPassword(req, res, next) {
    try {
      const { user_name, social_login } = req.session;
      res.render("user/pwConfirm", {
        isLogin: true,
        social_login,
        user_id: req.session.user,
        user_name,
      });
    } catch (error) {
      next(error);
    }
  },

  async renderProfile(req, res, next) {
    try {
      const { user, social_login } = req.session;
      const { user_id, user_name, user_phone } = await userService.getUser(
        user
      );
      res.render("user/myProfile", {
        isLogin: true,
        social_login,
        user_id,
        user_name,
        user_phone,
      });
    } catch (error) {
      next(error);
    }
  },

  async renderWithdrawal(req, res, next) {
    try {
      const { user, user_name, social_login } = req.session;
      const fresh_ingredients = await myPageService.getFreshIngdsAndCount(user);
      const frozen_ingredients = await myPageService.getFrozenIngdsAndCount(
        user
      );
      res.render("user/deleteAccount", {
        isLogin: true,
        social_login,
        user_name,
        fridge_ingredients_count:
          fresh_ingredients.count + frozen_ingredients.count,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = commonController;
