const { recipe } = require("../../model");

// exports.getRecipe = (req,res) => {
//     res.render("recipe/recipe");
// }

exports.getRecipe = async (req, res) => {
    // let result = await recipe.findAll(); 
    // console.log(result[0]);
    res.render("recipe/recipe");
}


