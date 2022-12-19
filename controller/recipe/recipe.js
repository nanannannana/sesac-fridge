const { recipe } = require("../../model");
const { log } = require("../../model");
const { recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

const { Op } = require("sequelize");  // where 안에 조건절을 위해

// 레시피 추천 페이지
exports.getRecipe = async (req, res) => {
    console.log(req.session.user);
    let freRes = await fresh.findAll({
        raw : true,
        attributes : [['fresh_name', 'name'], ['fresh_range', 'range']]
    })
    let froRes = await frozen.findAll({
        raw : true,
        attributes : [['frozen_name', 'name'], ['frozen_range', 'range']]
    })
    let ingdRes = [];   // fresh와 frozen에 있는 모든 값
    let ingdName = [];  // 식재료
    let ingdRange = []; // 수량

    // 식재료와 수량을 ingRes에
    freRes.forEach((item)=>{
        ingdRes.push(item)
    })
    froRes.forEach((item)=>{
        ingdRes.push(item)
    })
    
    // 식재료 수량 변수 각각 변수에 집어넣기
    for(var i=0;i<ingdRes.length;i++){
        ingdName.push(ingdRes[i].name);
        ingdRange.push(ingdRes[i].range);
    }
    let ingdNameStr = ingdName.join("|"); // 일치하는 재료를 찾기 위해서 ingName을 문자열로
 
    // 식재료가 있을 때
    if(ingdRes){
        let ingdRecipe = await recipe.findAll(
            {
                raw : true, // dataValues만 가져오기
                where : { recipe_ingd : { [Op.regexp] : ingdNameStr} }
            }
        )
        console.log(ingdName);
        console.log(ingdRange);
        res.render("recipe/recipe", {data : ingdRecipe, ingdName : ingdName, ingdRange : ingdRange});
    }else{ // 식재료가 없을 때
        let result = await recipe.findAll(
            {
                raw : true, 
                where : { recipe_tag : null }
            }
        );
        console.log("result : ", result);
        res.render("recipe/recipe", {data : result});
    }
    
}

// 필터로 검색
exports.getSelectFilter = async (req, res) => {
    console.log("req.query: ", req.query);
    let result = await recipe.findAll({
        raw : true, 
        where : { recipe_tag : req.query.tag }
    });
    switch(req.query.tag) {
        case "반찬" : 
            res.render("/recipe/sidedish", {data : result});
            console.log("rend가 왜안되냐고");
            break;
        case "밥" :
            res.render("recipe/rice", {data : result});
            break;
        case "국/탕" :
            res.render("recipe/soup", {data : result});
            break;
        case "건강/웰빙" :
            res.render("recipe/diet", {data : result});
            break;
        case "야식" :
            res.render("recipe/nightsnack", {data : result});
            break;
        default : 
            console.log("어딘가 이상합니다..?");
    }
}


// 최근에 본 레시피
exports.postInsertToLog = async (req,res) => {
    console.log(req.body.id);
    // 같은 레시피 id가 존재하면 log DB에 create 하지 않음
    let [find, create] = await log.findOrCreate({
        where : { recipe_recipe_id : req.body.id },
        defaults : {
            recipe_recipe_id : req.body.id,
            user_user_id : req.session.user,
        }
    });
    // find해서 create 하지 못해도 true넘기고, create해도 true
    if(create || find ) res.send(true);
}

// 좋아요
exports.postInsertToLike = async (req,res) => {
    // recipe tb에 컬럼 수정
    await recipe.update(
        {recipe_pick : 1},
        {where : { recipe_id : req.body.id }}
    )  
    // 같은 레시피 id가 존재하면 recipe_like DB에 create 하지 않음
    let [find, create]  = await recipe_like.findOrCreate({
        where : { recipe_recipe_id : req.body.id },
        defaults : {
            recipe_recipe_id : req.body.id,
            user_user_id : req.session.user
        }
    })
    // find에서 create 하지 못해도 true 넘기고, create해도 true
    res.send(true);
}