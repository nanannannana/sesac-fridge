const { user } = require("../../model/");

// exports.getRecipe = (req,res) => {
//     res.render("recipe/recipe");
// }

exports.getRecipe = async (req, res) => {
    let result = await user.findAll(); 
    console.log(result[0].user_id);
    console.log(result[0].user_pw);
    res.render("recipe/recipe");
}


