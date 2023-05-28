const { user } = require("../../model/");
const { fresh } = require("../../model/");
const { frozen } = require("../../model/");
const { recipe_like } = require("../../model/");
const { recipe } = require("../../model/");
const { log } = require("../../model/");
const { cooklog } = require("../../model/");
var sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

// 마이 페이지 렌더
exports.getMyPage = async function (req, res) {
  if (req.session.user) {
    const fresh_ingredients = await fresh.findAll({
      raw: true,
      where: { user_user_id: req.session.user },
    });
    const fresh_ingredients_category = [];
    for (const ingd of fresh_ingredients) {
      fresh_ingredients_category.push(ingd.fresh_category);
    }

    const cooked_dishes = await cooklog.findAll({
      raw: true,
      include: [
        {
          model: recipe,
          required: true,
          attributes: [
            "recipe_tag",
            "recipe_title",
            "recipe_url",
            "recipe_img",
          ],
        },
      ],
      where: { user_user_id: req.session.user },
      order: [["cooklog_id", "DESC"]],
      limit: 10,
    });
    const cooked_dishes_category = [];
    for (const dish of cooked_dishes) {
      if (dish["recipe.recipe_tag"]) {
        cooked_dishes_category.push(dish["recipe.recipe_tag"]);
      } else {
        cooked_dishes_category.push("기타");
      }
    }

    const recently_viewed_recipes = await log.findAll({
      raw: true,
      include: [
        {
          model: recipe,
          required: true,
          attributes: ["recipe_title", "recipe_url", "recipe_img"],
        },
      ],
      where: { user_user_id: req.session.user },
      order: [["log_id", "DESC"]],
      limit: 4,
    });

    res.render("user/myPage", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_name: req.session.user_name,
      fresh_ingredients_category: fresh_ingredients_category,
      cooked_dishes_category: cooked_dishes_category,
      cooked_dishes: cooked_dishes,
      recently_viewed_recipes: recently_viewed_recipes,
    });
  } else {
    res.render("main/alert404");
  }
};
exports.getMyPageChart = function (req, res) {
  // 냉장실 카테고리 문자열을 Object { "카테고리명": 개수 }로 변환
  const fresh_ingredients_category = {};
  req.query.fresh_ingredients_category.split(",").forEach((ingd_category) => {
    if (fresh_ingredients_category[ingd_category]) {
      fresh_ingredients_category[ingd_category] += 1;
    } else {
      if (!ingd_category) fresh_ingredients_category["none"] = 0;
      else fresh_ingredients_category[ingd_category] = 1;
    }
  });

  // 최근에 한 요리 카테고리 문자열을 Object { "카테고리명": 개수 }로 변환
  const cooked_dishes_category = {};
  req.query.cooked_dishes_category.split(",").forEach((cooked_dish) => {
    if (cooked_dishes_category[cooked_dish]) {
      cooked_dishes_category[cooked_dish] += 1;
    } else {
      if (!cooked_dish) cooked_dishes_category["none"] = 0;
      else cooked_dishes_category[cooked_dish] = 1;
    }
  });

  res.status(200).send({
    fresh_ingredients_category: fresh_ingredients_category,
    cooked_dishes_category: cooked_dishes_category,
  });
};

// 찜리스트 렌더
exports.getWishList = async function (req, res) {
  if (req.session.user) {
    const wishlist = await recipe_like.findAll({
      raw: true,
      attributes: { exclude: ["like_id", "user_user_id", "recipe_recipe_id"] },
      include: [
        {
          model: recipe,
          required: true,
          attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"],
        },
      ],
      where: { user_user_id: req.session.user },
    });

    res.render("user/wishList", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_name: req.session.user_name,
      wishlist: wishlist,
    });
  } else {
    res.render("main/alert404");
  }
};

// 찜리스트 정보 삭제
exports.deleteWishList = async function (req, res) {
  // 레시피 좋아요 수 조회
  const recipe_pick = await recipe.findOne({
    raw: true,
    attributes: ["recipe_pick"],
    where: { recipe_id: req.body.recipe_id },
  });

  if (recipe_pick.recipe_pick > 1) {
    await recipe.update(
      { recipe_pick: sequelize.literal("recipe.recipe_pick-1") },
      { where: { recipe_id: req.body.recipe_id } }
    );
  } else {
    await recipe.update(
      { recipe_pick: 0 },
      { where: { recipe_id: req.body.recipe_id } }
    );
  }
  await recipe_like.destroy({
    where: { recipe_recipe_id: req.body.recipe_id },
  });

  const wishlist = await recipe_like.findAll({
    raw: true,
    attributes: { exclude: ["like_id", "user_user_id", "recipe_recipe_id"] },
    include: [
      {
        model: recipe,
        required: true,
        attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"],
      },
    ],
    where: { user_user_id: req.session.user },
  });
  res.status(200).send(wishlist);
};

// 회원정보 수정 전 비밀번호 확인
exports.getShowCheckPassword = async function (req, res) {
  if (req.session.user) {
    res.render("user/pwConfirm", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_id: req.session.user,
      user_name: req.session.user_name,
    });
  } else {
    res.render("main/alert404");
  }
};
exports.postCheckPassword = async function (req, res) {
  const user_info = await user.findOne({
    where: { user_id: req.session.user },
  });

  if (user_info && bcrypt.compareSync(req.body.user_pw, user_info.user_pw)) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
};

// 회원정보 수정 페이지 렌더
exports.getShowProfile = async function (req, res) {
  if (req.session.user) {
    const user_info = await user.findOne({
      where: { user_id: req.session.user },
    });

    res.render("user/myProfile", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_id: req.session.user,
      user_name: req.session.user_name,
      user_phone: user_info.user_phone,
    });
  } else {
    res.render("main/alert404");
  }
};

// 회원탈퇴 렌더
exports.getShowUserWithdrawal = async function (req, res) {
  if (req.session.user) {
    const fresh_ingredients = await fresh.findAndCountAll({
      where: { user_user_id: req.session.user },
    });
    const frozen_ingredients = await frozen.findAndCountAll({
      where: { user_user_id: req.session.user },
    });

    res.render("user/deleteAccount", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_name: req.session.user_name,
      fridge_ingredients_count:
        fresh_ingredients.count + frozen_ingredients.count,
    });
  } else {
    res.render("main/alert404");
  }
};
