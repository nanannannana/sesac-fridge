const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");
const { user } = require("../../model");
const { Op } = require("sequelize");




//global variables
//로그인 시각 기준으로 시간 set
    let today = new Date();  
    
    let date = new Date(); // 오늘+2일 후
    date.setDate( date.getDate()+2 ); 

    let exp_list_arr = new Array(); // 유통기한 지난 식재료 > getMain - exp_list에서 받을 예정
    
// 메인 페이지 렌더 - 영은
exports.getMain = async (req,res) => {
    // render시 필요한 key-value's
    // [1] 자동 로그인 여부 T/F - req.cookies.user_id
    // [2] 로그인 여부 T/F - isLogin
    // [3] 유통기한 임박(2일 이내) 식재료 수 - fresh_count
    // [4] 유통기한 지난 식재료 수 - exp_count (식재료 목록도 필요)
    console.log("session_id: ", req.session.user);
    // 로그인 여부로 if문을 나눔

    const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
    // 자동로그인 여부 확인
    // 자동로그인 설정X(쿠키 값 undefined): final_user_id는 req.session.user(세션에 넣어둔 user_id값이 아이디가 됨)
    // 자동로그인 설정O(쿠키 값 有): final_user_id는 req.cookies.user_id(쿠키에 넣어둔 user_id값이 아이디가 됨)

    // 1) 로그인(+ 자동로그인)을 한 경우,
    if (req.cookies.user_id || req.session.user) {
        // 임박 식재료 개수
        let fresh_count = await fresh.findAndCountAll({
            where: {
                fresh_expire : {
                    [Op.gte] : today,
                    [Op.lte] : date
                },
                user_user_id : final_user_id               
            },
        })
        // 유통기한 지난 식재료 개수 & list
        let exp_list = await fresh.findAndCountAll({
            where : {
                fresh_expire : {
                    [Op.lt] : today
                },
                user_user_id : final_user_id
            }
        })
        exp_list_arr=exp_list.rows; //global 배열에 유통기한 지난 식재료 목록 담음 

        res.render("main/main", {
            isLogin : true, 
            fresh_count : fresh_count.count,
            exp_count : exp_list.count,
        }); 
    } else { // 1) 로그인(+ 자동로그인)을 하지 않은 경우,
        res.render("main/main", {
            isLogin : false, 
            fresh_count : false,
            exp_count : false,
        });  
    }
}

// getMain에서 담은 유통기한 지난 식재료 global 배열 exp_list_arr
// 의 요소들 DB에서 차례로 삭제
exports.deleteDeleteAlert = async (req,res) => {
    const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
    let list = [];

    for(i=0; i<exp_list_arr.length; i++){
        list.push( exp_list_arr[i].fresh_name );

        let result = await fresh.destroy({ 
            where : {
                user_user_id : final_user_id,
                fresh_name : exp_list_arr[i].fresh_name
            }
        });
    }
    
    console.log('delete list : ', list); 
    res.send({ list : list});
}


// localStorage에 저장할 현재 보관 중인 식재료
exports.postFridgeList= async (req, res)=>{
    const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;

    let freshList = await fresh.findAll({
        where : {user_user_id : final_user_id}
    });
    let frozenList = await frozen.findAll({
        where : {user_user_id : final_user_id}
    });
    let user_result = await user.findOne({
        where: {user_id: final_user_id}
    })
    res.send({freshList : freshList , frozenList : frozenList, username: user_result.user_name});
}

// 데이터 정규화
const { QueryTypes } = require("sequelize"); 
const { sequelize } = require("../../model"); 

exports.getDbRegex = async (req,res) => {
    console.log( "path : /, method : get" );
    // user 테이블에 존재하는 사용자들 가져와 index.ejs 로 전달하기
    let recipes = await recipe.findAll();
    await res.render("main/dbRegex", { result: recipes });    
}

exports.patchDbRegex = async (req,res) => {
    console.log( "path : /, method : patch" );
    console.log( "req.body : ", req.body );

    var sql = `UPDATE recipe SET recipe_ingd=REPLACE(recipe_ingd,',${req.body.b_ingd},' ,',${req.body.a_ingd},');`
    const result = await sequelize.query(sql, { type: QueryTypes.UPDATE });
    res.send({return: true, data: result});
}