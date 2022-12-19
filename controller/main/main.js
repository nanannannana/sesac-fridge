const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");

// 메인 페이지 렌더 - 주안

exports.getMain = async (req,res) => {

    var date = new Date();
    const log_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+2}`;

    // let result = await fresh.findAndCountAll({
    //     raw:true,
    //     include: [
    //         {
    //             model: recipe,
    //             attributes: ['recipe_ingd']
    //         }
    //     ],
    //     attributes: ['fresh_name'],
    //     where: {user_user_id: req.session.user}
    // })

    // console.log(result);

    if(req.session.user){ res.render("main/main")}
    else{ res.render("main/main"); }
    
}