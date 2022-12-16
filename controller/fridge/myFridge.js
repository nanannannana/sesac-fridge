const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model"); 


// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = async (req,res) => {
    let fresh_result = await fresh.findAll({
        order : [["fresh_expire", "ASC"]]
    });

    let frozen_result = await frozen.findAll({
        order : [["frozen_date", "ASC"]]
    });
    
    res.render("fridge/myFridge", { fresh_list : fresh_result, frozen_list : frozen_result });
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

// 냉장실에 새로운 식재료 추가
exports.postAddToFresh = async (req,res)=>{
    console.log( " postAddToFresh req.body : ", req.body );
        let data = {
            fresh_name : req.body.name,
            fresh_range : req.body.range,
            fresh_expire : req.body.expire
        }
    let result = await fresh.create(data);
    console.log( "postAddToFresh result : ", result);
    res.send( result );
}

// 냉동실에 새로운 식재료 추가
exports.postAddToFrozen = async (req,res)=>{
    console.log( " postAddToFrozen req.body : ", req.body );
        let data = {
            frozen_name : req.body.name,
            frozen_date : req.body.date,
            frozen_range : req.body.range
        }
    let result = await frozen.create(data);
    console.log( "postAddToFrozen result : ", result);
    res.send( result );
}