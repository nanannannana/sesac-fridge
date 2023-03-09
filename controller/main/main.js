const { fresh } = require('../../model');
const { frozen } = require('../../model');
const { recipe } = require('../../model');
const { user } = require('../../model');
const { Op } = require('sequelize');

//global variables
//로그인 시각 기준으로 시간 set
let today = new Date();

let date = new Date(); // 오늘+2일 후
date.setDate(date.getDate() + 2);

let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정

// 메인 페이지 렌더 - 영은
exports.getMain = async (req, res) => {
  // render시 필요한 key-value's
  // [1] 자동 로그인 여부 T/F - req.cookies.user_id
  // [2] 로그인 여부 T/F - isLogin
  // [3] 유통기한 임박(2일 이내) 식재료 수 - fresh_count
  // [4] 유통기한 지난 식재료 수 - exp_count (식재료 목록도 필요)
  const final_user_id =
    req.cookies.user_id === undefined ? req.session.user : req.cookies.user_id;
  console.log('final_user_id: ', final_user_id);
  // 자동로그인 여부 확인
  // 자동로그인 설정X(쿠키 값 undefined): final_user_id는 req.session.user(세션에 넣어둔 user_id값이 아이디가 됨)
  // 자동로그인 설정O(쿠키 값 有): final_user_id는 req.cookies.user_id(쿠키에 넣어둔 user_id값이 아이디가 됨)

  // 로그인 여부로 if문을 나눔
  // 1) 로그인(+ 자동로그인)을 한 경우,
  let recipe_result = await recipe.findAll({
    raw: true,
    order: [['recipe_pick', 'desc']],
    limit: 4,
  });
  console.log(recipe_result);
  if (req.cookies.user_id || req.session.user) {
    // 임박 식재료 개수
    let fresh_count = await fresh.findAndCountAll({
      where: {
        fresh_expire: {
          [Op.gte]: today,
          [Op.lte]: date,
        },
        user_user_id: final_user_id,
      },
    });
    // 유통기한 지난 식재료 개수 & list
    let exp_list = await fresh.findAndCountAll({
      where: {
        fresh_expire: {
          [Op.lt]: today,
        },
        user_user_id: final_user_id,
      },
    });
    exp_list_arr = exp_list.rows; //global 배열에 유통기한 지난 식재료 목록 담음
    let user_result = await user.findOne({
      attributes: ['user_name'],
      where: { user_id: final_user_id },
    });
    req.session.sql_name = user_result.user_name;
    const user_name =
      req.session.kakao_name == true
        ? req.session.kakao_name
        : req.session.sql_name;
    req.session.isLogin = true;
    req.session.fresh_count = fresh_count.count;
    req.session.exp_count = exp_list.count;

    res.render('main/main', {
      isLogin: req.session.isLogin,
      user_name: user_name,
      fresh_count: req.session.fresh_count,
      exp_count: req.session.exp_count,
      recipe: recipe_result,
    });
  } else {
    // 1) 로그인(+ 자동로그인)을 하지 않은 경우,
    res.render('main/main', {
      isLogin: false,
      user_name: false,
      fresh_count: false,
      exp_count: false,
      recipe: recipe_result,
    });
  }
};

// getMain에서 담은 유통기한 지난 식재료 global 배열 exp_list_arr
// 의 요소들 DB에서 차례로 삭제
exports.deleteDeleteAlert = async (req, res) => {
  const final_user_id =
    req.cookies.user_id === undefined ? req.session.user : req.cookies.user_id;
  let list = [];

  // for (i = 0; i < exp_list_arr.length; i++) {
  for (el of exp_list_arr) {
    list.push(el.fresh_name);

    let result = await fresh.destroy({
      where: {
        user_user_id: final_user_id,
        fresh_name: el.fresh_name,
      },
    });
  }

  console.log('delete list : ', list);
  res.send({ list: list });
};

// 데이터 정규화
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../model');

exports.getDbRegex = async (req, res) => {
  // user 테이블에 존재하는 사용자들 가져와 index.ejs 로 전달하기
  let recipes = await recipe.findAll();
  await res.render('main/dbRegex', { result: recipes });
};

exports.patchDbRegex = async (req, res) => {
  var sql = `UPDATE recipe SET recipe_ingd=REPLACE(recipe_ingd,',${req.body.b_ingd},' ,',${req.body.a_ingd},');`;
  const result = await sequelize.query(sql, { type: QueryTypes.UPDATE });
  res.send({ return: true, data: result });
};

exports.deletedb = async (req, res) => {
  var sql = `DELETE FROM recipe WHERE recipe_id=${req.body.id};`;
  const delResult = await sequelize.query(sql, { type: QueryTypes.DELETE });
  res.send(true);
};
