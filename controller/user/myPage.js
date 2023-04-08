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

// 마이 페이지 렌더 - 예지
exports.postMyPage = async function (req, res) {
  // 자동로그인 했을 떄
  if (req.cookies.user_id || req.session.user) {
    const final_user_id = !req.cookies.user_id
      ? req.session.user
      : req.cookies.user_id;
    // user 이름 확인
    let user_result = await user.findOne({
      raw: true,
      where: { user_id: final_user_id },
    });
    // 냉장고 재료 카테고리 가져오기
    var fresh_result = await fresh.findAll({
      raw: true,
      where: { user_user_id: final_user_id },
    });
    // 냉장고 카테고리 배열
    var fresh_category_list = [];
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
      where: { user_user_id: final_user_id },
      order: [["cooklog_id", "DESC"]],
      limit: 10,
    });
    // 최근에 한 요리 차트 관련 배열
    var cook_tag_list = [];
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
      where: { user_user_id: final_user_id },
      order: [["log_id", "DESC"]],
      limit: 4,
    });
    res.render("user/myPage", {
      isLogin: true,
      user_id: final_user_id,
      user_name: user_result.user_name,
      user_pw: user_result.user_pw,
      fresh_category: fresh_category_list,
      cook_tag: cook_tag_list,
      cook: cook_result,
      recipe: recipe_result,
    });
  } else {
    res.render("main/404");
  }
};
exports.postMyPageChart = function (req, res) {
  const fresh_category_list = req.body.fresh_category.split(",");
  const cook_tag_list = req.body.cook_tag.split(",");
  res.send([fresh_category_list, cook_tag_list]);
};

// 찜리스트 렌더
exports.postWishList = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    const final_user_id = !req.cookies.user_id
      ? req.session.user
      : req.cookies.user_id;
    // user 이름 확인
    let user_result = await user.findOne({
      raw: true,
      where: { user_id: final_user_id },
    });

    // 좋아요 게시글 조회
    let rec_like = await recipe_like.findAll({
      include: [
        {
          model: recipe,
          required: true,
          attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"],
        },
      ],
      where: { user_user_id: final_user_id },
    });

    res.render("user/wishList", {
      isLogin: true,
      user_name: user_result.user_name,
      user_id: final_user_id,
      user_pw: user_result.user_pw,
      rec_like: rec_like,
    });
  } else {
    res.render("main/404");
  }
};
// 찜리스트 정보 삭제
exports.deleteWishListDel = async function (req, res) {
  const final_user_id =
    req.cookies.user_id === undefined ? req.session.user : req.cookies.user_id;
  console.log("del:", req.body.num);

  // recipe_pick 수 조회
  let recipe_result = await recipe.findOne({
    where: { recipe_id: req.body.recipe_id },
  });
  console.log("recipe pick 조회: ", recipe_result.recipe_pick);

  // recipe_pick이 = 1이면 0, > 1 이면 recipe_pick-1
  switch (Number(recipe_result.recipe_pick)) {
    case 1:
      console.log("case1 입니다.");
      await recipe.update(
        { recipe_pick: 0 },
        { where: { recipe_id: req.body.recipe_id } }
      );
      break;
    default:
      console.log("default 입니다.");
      await recipe.update(
        { recipe_pick: sequelize.literal("recipe.recipe_pick-1") },
        { where: { recipe_id: req.body.recipe_id } }
      );
      break;
  }

  // DB에서 삭제할 좋아요 레시피 id 조회 및 삭제
  let like_id_result = await recipe_like.findOne({
    where: { recipe_recipe_id: req.body.recipe_id },
  });
  console.log("찜리스트 ID 조회: ", like_id_result.like_id);
  await recipe_like.destroy({ where: { like_id: like_id_result.like_id } });

  // recipe와 recipe_like table join 후, 필요한 데이터 조회
  let rec_like = await recipe_like.findAll({
    include: [
      {
        model: recipe,
        required: true,
        attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"],
      },
    ],
    where: { user_user_id: final_user_id },
  });
  res.send(rec_like);
};

// 회원정보 수정 전 비밀번호 확인
exports.postPwInput = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    const final_user_id = !req.cookies.user_id
      ? req.session.user
      : req.cookies.user_id;
    const user_result = await user.findOne({
      where: { user_id: final_user_id },
    });
    res.render("user/pwConfirm", {
      isLogin: true,
      user_pw: user_result.user_pw,
      user_id: final_user_id,
      user_name: user_result.user_name,
    });
  } else {
    res.render("main/404");
  }
};
exports.postPwConfirm = async function (req, res) {
  let result = await user.findAll({
    where: { user_id: req.body.user_id, user_pw: req.body.user_pw },
  });
  if (result.length > 0) res.send(true);
  else res.send(false);
};

// 회원정보 수정 페이지 렌더
exports.postMyInfo = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    let result = await user.findOne({ where: { user_id: req.body.user_id } });
    res.render("user/myInfo", {
      isLogin: true,
      user_id: result.user_id,
      user_pw: result.user_pw,
      user_name: result.user_name,
      user_phone: result.user_phone,
    });
  } else {
    res.render("main/404");
  }
};

// 회원정보 수정
exports.patchMyInfoUpdate = async function (req, res) {
  let data = {
    user_id: req.body.user_id,
    user_pw: req.body.user_pw,
    user_name: req.body.user_name,
    user_phone: req.body.user_phone,
  };
  await user.update(data, { where: { user_id: req.body.user_id } });
  res.send(true);
};

// 회원탈퇴 렌더
exports.postMyInfoDel = async function (req, res) {
  if (req.cookies.user_id || req.session.user) {
    const final_user_id = !req.cookies.user_id
      ? req.session.user
      : req.cookies.user_id;
    let fresh_count = await fresh.findAndCountAll({
      where: { user_user_id: final_user_id },
    });
    let frozen_count = await frozen.findAndCountAll({
      where: { user_user_id: final_user_id },
    });
    let user_result = await user.findOne({
      where: { user_id: final_user_id },
    });
    res.render("user/myInfoDel", {
      isLogin: true,
      user_name: user_result.user_name,
      user_id: req.body.user_id,
      ingd_count: fresh_count.count + frozen_count.count,
    });
  } else {
    res.render("main/404");
  }
};
// 회원탈퇴 완료
exports.deleteMyInfoDel = async function (req, res) {
  if (req.cookies.access_token) {
    await axios
      .post("https://kapi.kakao.com/v1/user/unlink", null, {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }
  //쿠키 삭제
  const option = {
    httpOnly: true,
    maxAge: 0,
  };
  res.cookie("user_id", null, option);
  // 세션 삭제
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  await user.destroy({ where: { user_id: req.body.user_id } });
  res.send(true);
};
