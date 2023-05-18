const { user } = require("../../model/");
const { fresh } = require("../../model/");
const { frozen } = require("../../model/");
const { recipe_like } = require("../../model/");
const { recipe } = require("../../model/");
const { log } = require("../../model/");
const { cooklog } = require("../../model/");
const env = process.env;
var sequelize = require("sequelize");
const axios = require("axios");
const bcrypt = require("bcryptjs");

// 마이 페이지 렌더
exports.getMyPage = async function (req, res) {
  // 자동로그인 했을 떄
  if (req.cookies.user_id || req.session.user) {
    // user 이름 확인
    const user_result = await user.findOne({
      raw: true,
      where: { user_id: req.cookies.user_id || req.session.user },
    });

    // 냉장고 재료 카테고리 가져오기
    let fresh_result = await fresh.findAll({
      raw: true,
      where: { user_user_id: req.cookies.user_id || req.session.user },
    });

    // 냉장고 카테고리 배열
    let fresh_category_list = [];
    for (var i = 0; i < fresh_result.length; i++) {
      fresh_category_list.push(fresh_result[i].fresh_category);
    }

    // 최근에 한 요리 최신순 4개 가쟈오기
    let cook_result = await cooklog.findAll({
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
      where: { user_user_id: req.cookies.user_id || req.session.user },
      order: [["cooklog_id", "DESC"]],
      limit: 10,
    });

    // 최근에 한 요리 차트 관련 배열
    let cook_tag_list = [];
    for (var j = 0; j < cook_result.length; j++) {
      if (cook_result[j]["recipe.recipe_tag"] == null) {
        cook_tag_list.push("기타");
      } else {
        cook_tag_list.push(cook_result[j]["recipe.recipe_tag"]);
      }
    }

    // 최근에 본 레시피 최신순 10개 가져오기
    let recipe_result = await log.findAll({
      raw: true,
      include: [
        {
          model: recipe,
          required: true,
          attributes: ["recipe_title", "recipe_url", "recipe_img"],
        },
      ],
      where: { user_user_id: req.cookies.user_id || req.session.user },
      order: [["log_id", "DESC"]],
      limit: 4,
    });
    res.render("user/myPage", {
      isLogin: true,
      user_name: user_result.user_name,
      user_pw: user_result.user_pw == "kakao" ? user_result.user_pw : "",
      fresh_category: fresh_category_list,
      cook_tag: cook_tag_list,
      cook: cook_result,
      recipe: recipe_result,
    });
  } else {
    res.render("main/alert404");
  }
};
exports.getMyPageChart = function (req, res) {
  const fresh_category_list = req.query.fresh_category.split(",");
  const cook_tag_list = req.query.cook_tag.split(",");
  res.send([fresh_category_list, cook_tag_list]);
};

// 찜리스트 렌더
exports.getWishList = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    // user 이름 확인
    const user_result = await user.findOne({
      raw: true,
      where: { user_id: req.cookies.user_id || req.session.user },
    });

    // 좋아요 게시글 조회
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
      where: { user_user_id: req.cookies.user_id || req.session.user },
    });

    res.render("user/wishList", {
      isLogin: true,
      user_name: user_result.user_name,
      user_pw: user_result.user_pw == "kakao" ? user_result.user_pw : "",
      wishlist: wishlist,
    });
  } else {
    res.render("main/alert404");
  }
};
// 찜리스트 정보 삭제
exports.deleteWishList = async function (req, res) {
  // recipe_pick 수 조회
  const recipe_result = await recipe.findOne({
    where: { recipe_id: req.body.recipe_id },
  });

  // recipe_pick이 = 1이면 0, > 1 이면 recipe_pick-1
  switch (Number(recipe_result.recipe_pick)) {
    case 1:
      await recipe.update(
        { recipe_pick: 0 },
        { where: { recipe_id: req.body.recipe_id } }
      );
      break;
    default:
      await recipe.update(
        { recipe_pick: sequelize.literal("recipe.recipe_pick-1") },
        { where: { recipe_id: req.body.recipe_id } }
      );
      break;
  }

  // DB에서 삭제할 좋아요 레시피 id 조회 및 삭제
  const like_id_result = await recipe_like.findOne({
    where: { recipe_recipe_id: req.body.recipe_id },
  });
  await recipe_like.destroy({ where: { like_id: like_id_result.like_id } });

  // recipe와 recipe_like table join 후, 필요한 데이터 조회
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
    where: { user_user_id: req.cookies.user_id || req.session.user },
  });
  res.send(wishlist);
};

// 회원정보 수정 전 비밀번호 확인
exports.getShowCheckPassword = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    const user_result = await user.findOne({
      where: { user_id: req.cookies.user_id || req.session.user },
    });
    res.render("user/pwConfirm", {
      isLogin: true,
      user_id: req.cookies.user_id || req.session.user,
      user_pw: user_result.user_pw == "kakao" ? user_result.user_pw : "",
      user_name: user_result.user_name,
    });
  } else {
    res.render("main/alert404");
  }
};
exports.postCheckPassword = async function (req, res) {
  const resultUser = await user.findOne({
    where: { user_id: req.cookies.user_id || req.session.user },
  });

  if (resultUser && bcrypt.compareSync(req.body.user_pw, resultUser.user_pw)) {
    res.send(true);
  } else {
    res.send(false);
  }
};

// 회원정보 수정 페이지 렌더
exports.getShowProfile = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    const result = await user.findOne({
      where: { user_id: req.cookies.user_id || req.session.user },
    });
    res.render("user/myProfile", {
      isLogin: true,
      user_id: result.user_id,
      user_pw: result.user_pw == "kakao" ? result.user_pw : "",
      user_name: result.user_name,
      user_phone: result.user_phone,
    });
  } else {
    res.render("main/alert404");
  }
};

// 회원탈퇴 렌더
exports.getShowUserWithdrawal = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    let fresh_count = await fresh.findAndCountAll({
      where: { user_user_id: req.cookies.user_id || req.session.user },
    });
    let frozen_count = await frozen.findAndCountAll({
      where: { user_user_id: req.cookies.user_id || req.session.user },
    });
    let user_result = await user.findOne({
      where: { user_id: req.cookies.user_id || req.session.user },
    });
    res.render("user/deleteAccount", {
      isLogin: true,
      user_name: user_result.user_name,
      ingd_count: fresh_count.count + frozen_count.count,
    });
  } else {
    res.render("main/alert404");
  }
};
