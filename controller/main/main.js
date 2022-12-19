const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");
const { user } = require("../../model");
const { Op } = require("sequelize");

// 메인 페이지 렌더 - 주안
exports.getMain = async (req,res) => {
    var exp_date = new Date();
    exp_date.setHours(23,59,59);
    console.log("exp_date : ",exp_date);

    let today = new Date();
    var date = new Date(); //date : 이틀 후
    date.setDate( date.getDate()+2 ); 
    console.log( "date: ",  date );
    // 로그인 한 경우,
   
    // 임박 식재료 개수
        let fresh_count = await fresh.findAndCountAll({
            where: {
                fresh_expire : {
                    [Op.gte] : today,
                    [Op.lte] : date
                }
            },
        })
    // 유통기한 지난 식재료 개수 & list
        let exp_list = await fresh.findAndCountAll({
            where : {
                fresh_expire : {
                    [Op.lt] : date
                }
            }
        })
        console.log("log fresh_count :", fresh_count.count );
        console.log("log exp_list :", exp_list.count );
    // user name
    if(req.session.user){ 
        let user_name = await user.findOne({
            attributes : ["user_name"],
            where : {user_id : req.session.user}
        });


    console.log("log user_id : ", user_name );

        res.render("main/main", { 
            isLogin : true, 
            fresh_count : fresh_count.count,
            exp_count : exp_list.count,
            user_name : user_name
        }); 
    }
    else{ res.render("main/main", { 
        isLogin : false, 
        fresh_count : false,
        exp_count : false,
        user_name : false
    });  }
}

exports.postCookie = (req, res) => {
    res.cookie("EXP_MODAL","1", {
        httpOnly : true,
        expires : exp_date,
        secure : false
    });
}


