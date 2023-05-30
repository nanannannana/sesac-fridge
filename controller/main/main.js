const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");
const { user } = require("../../model");
const { Op } = require("sequelize");

//global variables
//로그인 시각 기준으로 시간 set
let today = new Date();

let date = new Date(); // 오늘+2일 후
date.setDate(date.getDate() + 2);

let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정

// 메인 페이지 렌더 - 영은
exports.getMain = async (req, res) => {
  // render시 필요한 key-value's
  // [1] 로그인 여부 T/F - isLogin
  // [2] 유통기한 임박(2일 이내) 식재료 수 - fresh_count
  // [3] 유통기한 지난 식재료 수 - exp_count (식재료 목록도 필요)
  const popular_recipes = await recipe.findAll({
    raw: true,
    order: [["recipe_pick", "desc"]],
    limit: 4,
  });

  if (req.session.user) {
    // 임박 식재료 개수
    let fresh_count = await fresh.findAndCountAll({
      where: {
        fresh_expire: {
          [Op.gte]: today,
          [Op.lte]: date,
        },
        user_user_id: req.session.user,
      },
    });
    // 유통기한 지난 식재료 개수 & list
    let exp_list = await fresh.findAndCountAll({
      where: {
        fresh_expire: {
          [Op.lt]: today,
        },
        user_user_id: req.session.user,
      },
    });
    exp_list_arr = exp_list.rows; //global 배열에 유통기한 지난 식재료 목록 담음

    const user_info = await user.findOne({
      attributes: ["user_name"],
      where: { user_id: req.session.user },
    });

    req.session.user_name = user_info.user_name;
    req.session.fresh_count = fresh_count.count;
    req.session.exp_count = exp_list.count;

    res.render("main/main", {
      isLogin: true,
      kakao_login: req.session.kakao_login,
      user_name: req.session.user_name,
      fresh_count: req.session.fresh_count,
      exp_count: req.session.exp_count,
      popular_recipes: popular_recipes,
    });
  } else {
    res.render("main/main", {
      isLogin: false,
      kakao_login: false,
      user_name: false,
      fresh_count: false,
      exp_count: false,
      popular_recipes: popular_recipes,
    });
  }
};

// getMain에서 담은 유통기한 지난 식재료 global 배열 exp_list_arr
// 의 요소들 DB에서 차례로 삭제
exports.deleteDeleteAlert = async (req, res) => {
  let list = [];

  // for (i = 0; i < exp_list_arr.length; i++) {
  for (el of exp_list_arr) {
    list.push(el.fresh_name);

    let result = await fresh.destroy({
      where: {
        user_user_id: req.session.user,
        fresh_name: el.fresh_name,
      },
    });
  }

  console.log("delete list : ", list);
  res.send({ list: list });
};

// 데이터 정규화
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../model");

// DB 데이터 전부 가져오기
exports.getDbRegex = async (req, res) => {
  let recipes = await recipe.findAll();
  await res.render("main/dbRegex", { result: recipes });
};

// DB 특정 데이터 업데이트
exports.patchDbRegex = async (req, res) => {
  let sql = `UPDATE recipe SET recipe_ingd=REPLACE(recipe_ingd,',${req.body.b_ingd},' ,',${req.body.a_ingd},');`;
  const result = await sequelize.query(sql, { type: QueryTypes.UPDATE });
  res.send({ return: true, data: result });
};

// DB 특정 데이터 삭제
exports.deletedb = async (req, res) => {
  let sql = `DELETE FROM recipe WHERE recipe_id=${req.body.id};`;
  const delResult = await sequelize.query(sql, { type: QueryTypes.DELETE });
  res.send(true);
};
