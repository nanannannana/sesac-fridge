const { recipe } = require("../../model");
const { log } = require("../../model");
const { recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

const { Op } = require("sequelize");  // where 안에 조건절을 위해
const e = require("express");

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
        let ingdNameStr = ingdName.join(",|,"); // 일치하는 재료를 찾기 위해서 ingName을 문자열로

        // 실제 되는 값
        // 식재료가 있을 때 일치하는 식재료가 있으면 보여주고, 식재료가 없을 때는 recipe_tag가 null값인 것 을 보여준다.
        let where = {};
        
        if(ingdRes){ // 식재료랑 일치하는 레시피가 있을 때,
            where["recipe_ingd"] = { [Op.regexp] : ingdNameStr};
            if(req.query.tag) {
                where["recipe_tag"] = req.query.tag;
            }
        }else{ // 식재료랑 일치하는 레시피가 0개 (냉장고가 빈 사람포함)
            where["recipe_tag"] = null;
        }
        console.log("태그값", req.query.tag);
        
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

    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
  
        let ingdName = [];        // 받아온 재료 이름
        let ingdRange = [];       // 받아온 재료 비율
        let deleteArr = [];       // 받아온 재료에서 삭제할 이름과 비율
        let afterDelName = [];    // 삭제하고 난 뒤 받을 이름 배열
        let afterDelRange = [];   // 삭제하고 난 뒤 받을 비율 배열
        let afterDelResult = [];  // 삭제하고 난 뒤 받은 배열

        // range가 0일 때 바로 그냥 삭제 하기, update 시킬 필요 없이 굳이 바꿀 필요 없음
        req.body.forEach((item)=>{
            // console.log("item", item.name); // item { name : '사과', range : 50} item.name, item.range
            // console.log("range", item.range)
            ingdName.push(item.name);
            ingdRange.push(item.range);

            if(item.range == 0) {
                deleteObj = {
                    "delname" : item.name,
                    "range" : item.range,
                }
                deleteArr.push(deleteObj);
                console.log("deleteObj",deleteObj);
            }
        })
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
        
        console.log("deleteArr ",deleteArr);
        console.log("freRes ",freRes);
        console.log("froRes ",froRes);

       
        
        // deleteArr의 배열이 freRes의 배열보다 클 때
        if(deleteArr) { // deleteArr가 있는 경우 
             // deleteArr가 fresh 테이블에만 있는 경우
            if(deleteArr.length < freRes.length)// delteArr의 배열이 freRes의 배열보다 작을 때
                for(var i=0; i<freRes.length; i++) { 
               
            }else if(deleteArr.length > freRes.length) { // deleteArr의 배열이 freRes의 배열보다 클 때

            }
        }
       
        // // deleteArr의 배열이 freRes의 배열보다 작을 때
        // for(var i=0; i<freRes.length; i++) { // freRes의 배열만큼 돌리는 데
        //     if(deleteArr[i].name) {          // deleteArr가 있을 때만
        //         if(freRes[i].name == deleteArr[i].name) {
        //             destroy = await fresh.destroy({
        //                 where : {
        //                     user_user_id : req.session.user,
        //                     fresh_name : deleteArr[i].name
        //                 }
        //             });
        //         }
        //     }
        // }

        // 결과
        if(freRes && froRes.length == 0) { // fresh 테이블에만 있는 경우
            let result ; 
            for(var i=0; i<freRes.length; i++){
                let data = { fresh_range : ingdRange[i]};
                result = await fresh.update(data, {
                    where : {
                        user_user_id : final_user_id,
                        fresh_name : ingdName[i]
                    }
                })
            }
            console.log(result);

            // 수정 되었으면 새로고침(1이면 수정되어서 새로고침, 0이면 새로고침 불필요)
            if(result[0] == 1){ 
                res.send("1");
            }
            if(result[0] == 0){
                res.send("0");
            }
        }else if(froRes && freRes.length == 0) { // frozen 테이블에만 있는 경우
            let result;
            for(var i=0; i<froRes.length; i++){
                let data = { frozen_name : ingdRange[i]};
                result = await frozen.update(data, {
                    where : {
                        user_user_id : final_user_id,
                        frozen_name : ingdName[i]
                    }
                })
            }
            // 수정 되었으면 새로고침(1이면 수정되어서 새로고침, 0이면 새로고침 불필요)
            console.log(result);
            if(result[0] == 1){ 
                res.send("1");
            }
            if(result[0] == 0){
                res.send("0");
            }
        }else if(froRes.length>0 && freRes.length>0) { // fresh 테이블과 frozen테이블 둘 다 있는 경우
            let freshRes ;  // fresh 결과 담을 변수
            let frozenRes; // frozen 결과 담을 변수
            console.log("freRes 결과 : ", freRes);
            console.log("froRes 결과 : ", froRes);
            console.log("freRes[0].range", freRes[0].range);

            if(freRes){ // fresh 결과가 있을 때
                for(var i=0; i<freRes.length; i++){
                    let data = { fresh_range : ingdRange[i]};
                    freshRes = await fresh.update(data, {
                        where : {
                            user_user_id : final_user_id,
                            fresh_name : freRes[i].name,
                        }
                    })
                }
            }
            if(froRes){ // frozen 결과가 있을 때
                for(var i=0; i<froRes.length; i++){
                    let data = { frozen_range : ingdRange[i]};
                    frozenRes = await frozen.update(data, {
                        where : {
                            user_user_id : final_user_id,
                            frozen_name : froRes[i].name,
                        }
                    })
                }
            }
            console.log(freshRes, frozenRes);
            // 수정 되었으면 새로고침(1이면 수정되어서 새로고침, 0이면 새로고침 불필요)
            if(freshRes[0] == 1 && frozenRes[0] == 1){ 
                res.send("1");
            }
            if(freshRes[0] == 0 && frozenRes[0] == 0){
                res.send("0");
            }
        }
    }
}

// delteIngd("fresh", "fresh_name", req.body.name);
function delteIngd(tbname, colname, name) {
        let result;
        result = tbname.destroy({
            where : {
                user_user_id : req.session.user,
                colname : name,
            }
        })
    return result;
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