const { recipe } = require("../../model");
const { log } = require("../../model");
const { recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

const { Op } = require("sequelize");  // where 안에 조건절을 위해


// 레시피 추천 페이지 유저 갖고 있는 재료 기준으로
exports.getRecipe = async (req, res) => {
    
    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
        console.log("유저 : ", final_user_id);

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
        console.log("ingdName : ", ingdName);
        console.log("ingdRange : ", ingdRange);
        let ingdNameStr = ingdName.join(",|,"); // 정확하게 일치하는 재료를 찾기 위해서 ingName을 문자열로
        let bigIngdNameStr = ingdNameStr.replace(/,/g, ""); // 더 광범위한 재료 포함

        // 식재료가 있을 때 일치하는 식재료가 있으면 보여주고, 식재료가 없을 때는 recipe_tag가 null값인 것 을 보여준다.
        let where = {};

        if(ingdRes.length > 0){ // 식재료랑 정확하게 일치하는 레시피가 있을 때,
            where["recipe_ingd"] = { [Op.regexp] : ingdNameStr};
            
            // 빠른 한끼 태그일 때
            if(req.query.tag == "빠름") {
                let fastRes = await recipe.findAll({
                    raw : true,
                    where : { ["recipe_ingd"] : { [Op.regexp] : ingdNameStr} },
                    order : [
                        [ 'recipe_time', 'ASC']
                    ],
                    limit : 45
                })
                let result = { data : fastRes } 

                if (ingdRes) {
                    let ingdResult = []; 
                    for(var i=0; i<fastRes.length;i++) {
                        ingdResult.push(fastRes[i].recipe_ingd);
                    }
                    result["ingdName"] = ingdName;
                    result["ingdRange"] = ingdRange;
                    result["ingdResult"] = ingdResult;
                    result["isLogin"] = true;
                    result["tag"] = req.query.tag;
                }
                res.render("recipe/fastmeal", result);
            } 
            // 일반 태그일 때
            if(req.query.tag) {
                where["recipe_tag"] = req.query.tag;
            }
        } else { // 식재료랑 일치하는 레시피가 0개 (냉장고가 빈 사람포함)
            where["recipe_tag"] = null;
        }
        
        // recipe 테이블에 있는 데이터 가져오기(SELECT)
        if(req.query.tag != "빠름") {
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
                if(req.query.tag) {
                    result["tag"] = [req.query.tag];
                }
                if(!req.query.tag) {
                    result["tag"] = ["식재료 일치"];
                }
            }
            res.render("recipe/recipe", result);
        }
    }else { // 로그아웃 했을 때 
        let recipes = await recipe.findAll({
            raw : true, // dataValues만 가져오기
            where : {"recipe_tag" : null}
        });
        res.render("recipe/recipe_non", {isLogin : false, data : recipes});
    }
    
}

// 요리하기 버튼 눌렀을 때 fresh와 frozen DB에 해당 식재료 range 수정
exports.patchToFridge = async (req,res) => {
    // 삭제할 배열이 있을 때 삭제를 먼저 하고 나서 업데이트
    // 삭제할 배열
    let delArr = req.body.filter(item => {
        return item.delMust === "1";
    })
    console.log("delArr: ", delArr);

    // final_user_id를 사용하기 위해서(로그인 했을 때)
    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
        
        // [1] 삭제할 배열이 있을 때
        // 받은 데이터로 fresh와 frozen에서 일치하는 값을 찾아서 삭제
        if(delArr.length > 0) {
            let delName = [];  // 삭제할 이름
            
            delArr.forEach((item)=>{
                delName.push(item.name);
            })
            
            let freRes = await fresh.findAll({
                raw:true,
                attributes: [['fresh_name', 'name']],
                where : {user_user_id : final_user_id, fresh_name : delName}
            })
            
            console.log("삭제해야 할 freRes: ", freRes);
            console.log("delArr: ", delArr);

            // fresh테이블에서 나온 결과가 있을 때 fresh테이블에서 바로 삭제
            if(freRes.length > 0) { 
                console.log("fresh 테이블에서 삭제해야해요!");
                for(var i=0; i<freRes.length; i++) {
                    let result = await fresh.destroy({
                        where : {
                            user_user_id : final_user_id,
                            fresh_name : delName
                        }
                    })
                    console.log("fresh 삭제 결과: ", result);
                }
            }
            
            // 아직 frozen에서 삭제해야 할 재료가 남아있다. 
            // frozen에서 select 한 후 삭제
            if(freRes.length != delArr.length) { 
                let froRes = await frozen.findAll({
                    raw:true,
                    attributes: [['frozen_name', 'name']],
                    where : {user_user_id : final_user_id, frozen_name : delName} 
                })
                console.log("froRes", froRes);
                // 삭제
                for(var i=0;i<froRes.length;i++) {
                    let result = await frozen.destroy({
                        where : {
                            user_user_id : final_user_id,
                            frozen_name : froRes[i].name
                        }
                    })
                    console.log("frozen 삭제 결과: ", result);
                }
            }
        }

        // [2] 업데이트 할 배열이 있을 때
        // 업데이트할 배열
        let updateArr = req.body.filter(item => {
            return !item.delMust
        })
    
        let ingdName = [];    // 업데이트 할 재료 이름
        let ingdRange = [];   // 업데이트 할 재료 비율

        updateArr.forEach((item) => {
            ingdName.push(item.name);
            ingdRange.push(item.range);
        })
        
        if(updateArr.length > 0) {
            console.log("업데이트 해야 할 updateArr : ", updateArr);

            let freRes = await fresh.findAll({
                raw : true,
                attributes : [['fresh_name', 'name'], ['fresh_range', 'range']],
                where : {user_user_id : final_user_id, fresh_name : ingdName }
            })
            
            console.log("수정해야할 freRes: ", freRes);
            console.log("ingdName : ", ingdName); 
            console.log("ingdRange : ", ingdRange);

            // freRes에 있는 ingdName과 같은 것 == fresh에서 수정할 때 필요한 이름
            let freIngdName = ingdName.filter(item => {
                return freRes.some(other => other.name === item);
            })
            console.log(freIngdName);

            // fresh테이블에서 나온 결과가 있을 때 fresh테이블에서 바로 수정
            let freResult;
            if(freRes.length > 0) {
                for(var i=0; i<freRes.length; i++){
                    let data = { fresh_range : 50 };
                    freResult = await fresh.update(data, {
                        where : {
                            user_user_id : final_user_id,
                            fresh_name : freIngdName[i]
                        }
                    })
                    console.log("fresh 테이블에서 업데이트 결과: ", freResult);
                }
                
            }
            // freRes과 같지 않은 것 ==> frozen에 있는 IngdName == frozen에서 수정할 때 필요한 이름
            let froIngdName = ingdName.filter(item => {
                return !freRes.some(other => other.name === item);
            })
            console.log("froIngdName", froIngdName);

            // fresh 테이블에서만 업데이트가 있는 경우에 res.send
            if(freResult && !froIngdName){
                res.send(freResult);
            }
            // 아직 frozen에서 삭제해야 할 재료가 남아있다. 
            // frozen에서 select 한 후 업데이트
            if(freRes.length != updateArr.length) { 
                let froRes = await frozen.findAll({
                    raw : true,
                    attributes : [['frozen_name', 'name'], ['frozen_range', 'range']],
                    where : {user_user_id : final_user_id, frozen_name : ingdName }
                })
                console.log("frozen테이블에서 삭제해야 할 froRes: ", froRes)
             
                let result;
                for(var i=0; i<froRes.length; i++) {
                    let data = { frozen_range : 50};
                    result = await frozen.update(data, {
                        where : {
                            user_user_id : final_user_id,
                            frozen_name : froIngdName[i]
                        }
                    })
                    console.log("frozen 업데이트 결과: ", result);
                }
                res.send(result);
            }
        }
    }
}


// 최근에 본 레시피
exports.postInsertToLog = async (req,res) => {
   
    const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
    // 같은 레시피 id가 존재하면 log DB에 create 하지 않음
    let [find, create] = await log.findOrCreate({
        where : { recipe_recipe_id : req.body.id },
        defaults : {
            recipe_recipe_id : req.body.id,
            user_user_id : final_user_id,
        }
    });
    // find해서 create 하지 못해도 true넘기고, create해도 true
    if(create || find ) res.send(true);
}

// 좋아요
exports.postInsertToLike = async (req,res) => {

    const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
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
            user_user_id : final_user_id,
        }
    })
    // find에서 create 하지 못해도 true 넘기고, create해도 true
    res.send(true);
}

