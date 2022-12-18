const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");

// 메인 페이지 렌더 - 주안
exports.getMain = async (req,res) => {

    if(req.session.user){let log_time=new Date(today.setDate(today.getDate() + 2));}

    // let result = await fresh.findAndCountAll({
    //     where : {

    //     }
    // })
    res.render("/main/main");
}