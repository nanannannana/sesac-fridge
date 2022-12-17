const { recipe } = require("../../model");

// exports.getRecipe = (req,res) => {
//     res.render("recipe/recipe");
// }

// 레시피 추천 페이지
exports.getRecipe = async (req, res) => {
    let result = await recipe.findAll({
        raw : true, // dataValues만 가져오기
        where : { recipe_tag : null }
    }); 
    console.log(result[0]);
    res.render("recipe/recipe", {data : result[0]});
}


