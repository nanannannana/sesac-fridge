const { recipe } = require("../../model");
const { log } = require("../../model");
const { recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

const { Op } = require("sequelize");  // where 안에 조건절을 위해
const e = require("express");

// 레시피 추천 페이지 유저 갖고 있는 재료 기준으로
exports.getRecipe = async (req, res) => {
    console.log("유저 : ", req.session.user);

    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
            
        let freRes = await fresh.findAll({
            raw : true,
            attributes : [['fresh_name', 'name'], ['fresh_range', 'range']],
            where : { user_user_id : final_user_id}
        })
        let froRes = await frozen.findAll({
            raw : true,
            attributes : [['frozen_name', 'name'], ['frozen_range', 'range']],
            where : { user_user_id : final_user_id}
        })
        let ingdRes = [];   // fresh와 frozen에 있는 모든 값
        let ingdName = [];  // 식재료
        let ingdRange = []; // 수량

        // 냉장, 냉동 테이블에서 select한 결과 합쳐서 ingdRes에 넣기
        freRes.forEach((item)=>{
            ingdRes.push(item)
        })
        froRes.forEach((item)=>{
            ingdRes.push(item)
        })

        // 식재료 이름, 비율, pk를 각각 ingdName과 ingdRange에 집어넣기
        for(var i=0;i<ingdRes.length;i++){
            ingdName.push(ingdRes[i].name + "");
            ingdRange.push(ingdRes[i].range);
        }
        let ingdNameStr = ingdName.join(",|,"); // 일치하는 재료를 찾기 위해서 ingName을 문자열로

        console.log("ingdNameStr 나오게 하기ㄹㅇㄴㅇㄹㄹ: ",ingdNameStr);
        // 식재료가 있을 때 일치하는 식재료가 있으면 보여주고, 식재료가 없을 때는 recipe_tag가 없는 것을 보여준다.
        let where = {};
        if ( ingdRes ) where["recipe_ingd"] = { [Op.regexp] : ingdNameStr};
        else where["recipe_tag"] = null;
        if ( req.query.tag ) where["recipe_tag"] = req.query.tag;

        console.log("req.query.tag: ", req.query.tag);
        // recipe 테이블에 있는 데이터 가져오기
        let recipes = await recipe.findAll({
            raw : true, // dataValues만 가져오기
            where
        });
        let result = { data: recipes }; // 데이터 결과를 result안에 집어넣기.

        // 식재료가 있을 때 프론트 단에서 사용할 나의 재료 이름과 수량
        if ( ingdRes ) {
            let ingdResult = []; 
            for(var i=0; i<recipes.length;i++) {
                ingdResult.push(recipes[i].recipe_ingd);
            }
            result["ingdName"] = ingdName;
            result["ingdRange"] = ingdRange;
            result["ingdResult"] = ingdResult;
            result["isLogin"] = true;
        }
        res.render("recipe/recipe", result);
    }else { // 로그아웃 했을 때 
        res.render("recipe/recipe_non", {isLogin : false});
    }
    
}

// 요리하기 버튼 눌렀을 때 fresh와 frozen DB에 해당 식재료 range 수정
exports.patchToFridge = async (req,res) => {
    // console.log(req.body);

    if(req.body.result) { // 재료가 한 개로 있을 떄
        let freRes = await fresh.findAll({
            raw : true,
            attributes : [['fresh_name', 'name'], ['fresh_range', 'range']],
            where : {user_user_id : req.session.user , fresh_name : req.body.name}
        })
        let froRes = await frozen.findAll({
            raw : true,
            attributes : [['frozen_name', 'name'], ['frozen_range', 'range']],
            where : {user_user_id : req.session.user , frozen_name : req.body.name}
        })
        // console.log("freRes: ", freRes);
        // console.log("froRes: ", froRes);
        // console.log("freRes.length: ", freRes.length); 
        // console.log("froRes.length: ", froRes.length);

        let data = { fresh_range : req.body.range };
        
        // 결과
        if(freRes && froRes.length == 0) { // fresh 테이블에만 있는 경우
            let result = await fresh.update(data, {
                where : {
                    user_user_id : "root@naver.com",
                    fresh_name : req.body.name
                }
            }); 
            console.log('fresh update result: ', result);
            res.send(result);
        }else if(froRes && freRes.length == 0) { // frozen 테이블에만 있는 경우
            let result = await frozen.update(data, {
                where : {
                    user_user_id : "root@naver.com",
                    fresh_name : req.body.name
                }
            }); 
            console.log('frozen update result: ', result);
            res.send(result);
        }
        if(freRes && froRes) { // fresh 테이블과 frozen테이블 둘 다 있는 경우

        }

    }else {  // 재료가 여러개 있을 때(체크 박스 여러 개있는 alert창)
        let ingdName = [];
        let ingdRange = [];
        for(var i=0; i<req.body.length; i++) {
            ingdName.push(req.body[i].name);
            ingdRange.push(req.body[i].range);
        }
        let freRes = await fresh.findAll({
            raw : true,
            attributes : [['fresh_name', 'name'], ['fresh_range', 'range']],
            where : {user_user_id : "root@naver.com", fresh_name : ingdName }
        })
        let froRes = await frozen.findAll({
            raw : true,
            attributes : [['frozen_name', 'name'], ['frozen_range', 'range']],
            where : {user_user_id : "root@naver.com", frozen_name : ingdName }
        })
 
        
        // 결과
        if(freRes) { // fresh 테이블에 있는 경우
 
        }
        if(froRes) { // frozen 테이블에 있는 경우

        }
        if(freRes && froRes) { // fresh 테이블과 frozen테이블 둘 다 있는 경우

        }
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
            user_user_id : "root@naver.com",
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
            user_user_id : "root@naver.com",
        }
    })
    // find에서 create 하지 못해도 true 넘기고, create해도 true
    res.send(true);
}