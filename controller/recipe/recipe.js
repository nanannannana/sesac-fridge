const { recipe } = require("../../model");
const { log } = require("../../model");
const { recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

// 레시피 추천 페이지
exports.getRecipe = async (req, res) => {
    console.log(req.session.user);
    let result = await recipe.findAll({
        include : [{
            model : fresh,
        }],
        include : [{
            model : frozen,
        }],
        raw : true, // dataValues만 가져오기
        where : { recipe_tag : null }
    });
    console.log(result);
    res.render("recipe/recipe", {data : result});
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