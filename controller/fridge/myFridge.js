const { Fresh } = require("../../model/fresh");
const { Frozen } = require("../../model/frozen");
const { Recipe } = require("../../model/recipe"); 


// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = (req,res) => {
    res.render("fridge/myFridge");
}

// 선택한 식재료로 레시피 찾기
exports.postResultRecipe = (req,res) => {
    console.log( "req.body.checkedIngdList : ", req.body.checkedIngdList );
    // let result = await Recipe.findAll({
    //     attributes : [ "recipe_title" ],
    //     where : { recipe_ingd : req.body.checkedIngdList[0] }
    // } 
    // console.log("postResultRecipe result : ", result );
    res.send( true );
}

// 새로운 식재료 추가
exports.postAddIngd = (req,res)=>{
    console.log( " postAddIngd req.body : ", req.body );
    let data = {
        fresh_name : req.body.name,
        fresh_range : req.body.range,
        fresh_expire : req.body.expire
    };

    //let result = Fresh.create(data);

    res.send( data );
}