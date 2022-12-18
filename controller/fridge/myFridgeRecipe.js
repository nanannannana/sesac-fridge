const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model");


// 선택한 식재료로 레시피 찾기
exports.postResultRecipe = async (req,res) => {
    console.log( "req.body.checkedIngdList : ", req.body.checkedIngdList );
    console.log( req.body.checkedIngdList[0]);
    // let result = await recipe.findAndCountAll({
    //     where : { 
    //         recipe_ingd :  {
    //         },
    //     },
    // })
    console.log("postResultRecipe result : ", result );
    res.send( true );
}