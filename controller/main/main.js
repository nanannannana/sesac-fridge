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


    // 로그인 여부로 if문을 나눔
    // 1) 로그인(+ 자동로그인)을 한 경우,
    if (req.cookies.user_id || req.session.user) {
        // 자동로그인 여부 확인
        // 자동로그인 설정X(쿠키 값 undefined): final_user_id는 req.session.user(세션에 넣어둔 user_id값이 아이디가 됨)
        // 자동로그인 설정O(쿠키 값 有): final_user_id는 req.cookies.user_id(쿠키에 넣어둔 user_id값이 아이디가 됨)
        const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;

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

        // user name
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
    console.log("exp_list_arr : ", exp_list_arr);

    for(i=0; i<exp_list_arr.length; i++){
        let result = await fresh.destroy({ 
            where : {
                user_user_id : req.session.user,
                fresh_name : exp_list_arr[i].fresh_name
            }
        });
        console.log('delete result : ', result); 
    }
    res.send(true);
}