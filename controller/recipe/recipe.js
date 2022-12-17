const { recipe } = require("../../model");
const { log } = require("../../model");

// 레시피 추천 페이지
exports.getRecipe = async (req, res) => {
    let result = await recipe.findAll({
        raw : true, // dataValues만 가져오기
        where : { recipe_tag : null }
    }); 
    res.render("recipe/recipe.ejs", {data : result});
}

exports.postInsertToLog = async (req,res) => {
    console.log(req.body);
    console.log(req.session.user);
    let result = await log.create({
        recipe_recipe_id : req.body.id,
        user_user_id : req.session.user,
    })
    res.send(true);
}