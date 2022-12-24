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
    // 삭제할 배열
    let delArr = req.body.filter(item => {
        return item.delMust === "1";
    })
    console.log("delArr", delArr);
    // 업데이트할 배열
    let updateArr = req.body.filter(item => {
        return !item.delMust
    })
    console.log("updateArr :", updateArr);
    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
  
        let ingdName = [];        // 받아온 재료 이름
        let ingdRange = [];       // 받아온 재료 비율

        // 삭제하는 데 필요한 변수들 3개
        let deleteArr = [];       // 받아온 재료에서 삭제할 이름과 비율
        // 삭제할 재료가 fresh 테이블에도 있고, frozen 테이블에도 있을 때
        let filterDelfre = []; // 받아온 재료에서 fresh테이블에서 삭제할 때 필요
        let filterDelfro = []; // 받아온 재료에서 frozen테이블에서 삭제할 때 필요

        // 클라이언트에서 넘어온 데이터를 name과 range 배열로 나눠서 저장
        req.body.forEach((item)=>{
           
            ingdName.push(item.name);
            ingdRange.push(item.range);

            // range가 0일 때, update 시킬 필요 없이 DB에서 바로 삭제해야해서 deleteArr에 넣기
            if(item.range == 0) {
                let deleteObj = {
                    "name" : item.name,
                    "range" : item.range,
                }
                deleteArr.push(deleteObj);
            }
        })

        // 받은 데이터로 fresh와 frozen에서 일치하는 값을 찾아서 freRes와 froRes에 넣기
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
        
        console.log("deleteArr ",deleteArr); // [ {name : 양파, range: 0}]
        console.log("freRes ",freRes);       // [ { name : 청고추, range: 50}, {name : 양파, range:100}]
        console.log("froRes ",froRes);

        // 0이면 삭제하는 로직 안에 있는 함수 2개         
        // // [1] 중복여부 체크 함수(각 테이블의 select 결과와 삭제할 객체 배열을 비교해서 삭제할 배열 return)
        // function dblChk(Res, delArr) {
        //     let resStr = JSON.stringify(Res);
        //     let delObj = delArr.filter(item => {
        //         return resStr.indexOf(JSON.stringify(item))
        //     })
        //     return resStr, delObj
        // }

        // // [2] update문을 실행시키기 위한 함수 freRes or froRes, ingdName, ingdRange에서 range가 0인 요소 삭제
        // // ex) 두개의 배열(ingdName, delObj)을 비교하여 ingdName안에 delObj 값이 있다면 ingdName에서 그값을 제거
        // function delChk(obj, delObj) {
        //     if(obj === freRes || obj === froRes ) {
        //         result = obj.filter(item => {
        //             return !delObj.some(other => other.name === item.name);
        //         })
        //     }
        //     if(obj === ingdName) {
        //         result = obj.filter(item => {
        //             return !delObj.some(other => other.name === item);
        //         })
        //     }
        //     if(obj === ingdRange) {
        //         result = obj.filter(item => {
        //             return !delObj.some(other => other.range === item);
        //         })
        //     }
        // }
       
        // 받아온 데이터에서 range가 0일 때 삭제
        // deleteArr가 있는 경우 삭제
        // if(deleteArr) { 
        //      // delteArr의 배열이 freRes와 froRes의 배열보다 작을 때 
        //     if(deleteArr.length < freRes.length || deleteArr.length < froRes.length) {
        //         console.log("deleteArr가 freRes 보다 작아요");

        //         // freRes안에 있는 이름과 deleteArr의 이름이 같을 때(중복여부)
        //         let delObj = dblChk(freRes, deleteArr);
                
        //         // freRes, ingdRange, ingdName에서 삭제(update를 위해서)
        //         delChk(freRes, delObj);
        //         delChk(ingdName, delObj);
        //         delChk(ingdRange, delObj);
        //         console.log("삭제되고 난 후 ingdName:", ingdName);
        //         console.log("식제되고 난 후 ingdRange:", ingdRange);
        //         // delObj는 삭제할 배열, DB에서 삭제
        //         let result ;
        //         for(var i=0; i<delObj.length; i++) {
        //             result = await fresh.destroy({
        //                 where : {
        //                     user_user_id : final_user_id,
        //                     fresh_name : delObj[i].name
        //                 }
        //             })
        //         }
        //         console.log("삭제 결과: ", result);

        //         // deleteArr의 배열이 freRes의 배열보다 클 때
        //         // 예) deleteArr는 2개인데, fresh tb안에 한개, frozen tb안에 한개 일 때
        //     }else if(deleteArr.length > freRes.length || deleteArr.length > froRes.length) { 
        //         console.log("삭제할 요소가 커요")

        //         let leftFroIngdName;
        //         let leftFroIngdRange;

        //         // 1. deleteArr가 fresh테이블에 있는지 확인하고, 
        //         // 2. freRes에서 삭제하고 ingdName과 ingdRange 삭제
               
        //         // [1] 중복여부 체크 freRes안에 있는지 froRes에 있는지
        //         // freRes와 겹치는 것 === 삭제할 배열이 fresh테이블에 있는지
        //         filterDelfre = deleteArr.filter(item => {
        //             return freRes.some(other => other.name === item.name);
        //         })
        //         // froRes와 겹치는 것 === 삭제할 배열이 frozen테이블에 있는지
        //         filterDelfro = deleteArr.filter(item => {
        //             return !freRes.some(other => other.name === item.name);
        //         })
        //         console.log("같은 거 즉 freRes와 겹치는 것", filterDelfre);
        //         console.log("같지 않은 거 즉 froRes과 겹치는 것", filterDelfro);

        //          // 업데이트를 위한 freRes에 삭제되지 않는 값 넣고, 삭제해야할 값은 삭제
        //          if(filterDelfre) {
        //             console.log("fresh에서 삭제해야해요")
        //             console.log("freRes: ", freRes)
        //             // console.log("filterDelfre: ", filterDelfre);
        //             // console.log("ingdName: ", ingdName);
        //             // console.log("ingdRange: ", ingdRange);

        //             // 삭제해야할 filterDelfre와 겹치지 않는 것은 업데이트를 위해 freRes에 넣어서 넘겨준다.
        //             freRes = freRes.filter(item => {
        //                 return !filterDelfre.some(other => other.name === item.name);
        //             })
        //             // 삭제해야할 filterDelfre와 겹치는 것은 삭제하기 위해 delObj에 넣어준다.
        //             let freResStr = JSON.stringify(freRes);
        //             let delObj = filterDelfre.filter(item => {
        //                 return freResStr.indexOf(JSON.stringify(item))
        //             })
                    
        //             // 겹치는 게 결과가 있다면 삭제!
        //             if(delObj) {
        //                 let result ;
        //                 for(var i=0; i<delObj.length; i++) {
        //                     result = await fresh.destroy({
        //                         where : {
        //                             user_user_id : final_user_id,
        //                             fresh_name : delObj[i].name
        //                         }
        //                     })
        //                 }
        //                 console.log("fresh 삭제된 결과값 : ", result);
        //             }
        //             console.log("freRes :", freRes);
                    
        //             // 2 ingdName
        //             // 2-1. 겹치는 게 없다면 frozentb에 IngdName이 남았다는 소리
        //             // leftFroIngdName 에 삭제할 배열을 frozen에 넘겨준다.
        //             // leftFroIngdName = ingdName.filter(item => {
        //             //     return !filterDelfre.some(other => other.name === item);
        //             // })
        //             // // 2-2. 겹치는 게 있다면 ingdName에서 삭제해야 한다.
        //             // let ingdFreName = ingdName.filter(item => {
        //             //     return filterDelfre.some(other => other.name === item.name);
        //             // })

        //             // console.log("fresh 필터 적용 끝낸 뒤 업데이트 하기위한 freRes", freRes);
        //             // console.log("freshtb에서 ingdName에서 겹치는 식재료 삭제된 결과: ", ingdFreName);
        //          }

        //          // frozen tb에 삭제할 배열이 있는 경우
        //          if(filterDelfro) {
        //             console.log("frozen 삭제해야해요")
        //             console.log("froRes: ", froRes)
        //             // console.log("filterDelfro: ", filterDelfro);
        //             // console.log("ingdName: ", ingdName);
        //             // console.log("leftFroIngdName", leftFroIngdName);
        //             // console.log("ingdRange: ", ingdRange);

        //             // 삭제해야할 filterDelfro와 겹치지 않는 것은 업데이트를 위해 froRes에 넣어서 넘겨준다.
        //             froRes = froRes.filter(item => {
        //                 return !filterDelfro.some(other => other.name === item.name);
        //             })
        //             // 삭제해야할 filterDelfro와 겹치는 것은 삭제하기 위해 delObj에 넣어준다.
        //             let froResStr = JSON.stringify(froRes);
        //             let delObj = filterDelfro.filter(item => {
        //                 return froResStr.indexOf(JSON.stringify(item))
        //             })
        //             console.log("frozen에서 삭제해야할 delObj", delObj);
        //             // 겹치는 게 결과가 있다면 삭제!
        //             if(delObj) {
        //                 let result ;
        //                 for(var i=0; i<delObj.length; i++) {
        //                     result = await frozen.destroy({
        //                         where : {
        //                             user_user_id : final_user_id,
        //                             frozen_name : delObj[i].name
        //                         }
        //                     })
        //                 }
        //                 console.log("frozen 삭제된 결과값 : ", result); 
        //             }
        //             console.log("froRes: ", froRes)
                    
        //             // 2 freshtb에서 넘겨온 leftFroIngdName이 삭제해야할 filterDelFro와 겹친다면 삭제
        //             // let totalIngdNameRes;
                    
        //             // if(leftFroIngdName) {
        //             //     totalIngdNameRes = leftFroIngdName.filter(item => {
        //             //         return !filterDelfro.some(other => other.name === item);
        //             //     });
        //             // }
                    
        //             // console.log("frozen 필터 적용 끝낸 뒤 삭제결과", result);
        //             // console.log("frozen 필터 적용 끝낸 뒤 삭제결과 totalIngdNameRes", totalIngdNameRes);
        //          }
                 

                
        //     }
        //     // 삭제할 요소와 freRes와 동일할 때
        //     if(deleteArr.length === freRes.length) { 
        //         console.log("삭제할 요소와 freRes가 같아요");

        //         // freRes안에 있는 이름과 deleteArr의 이름이 같을 때(중복여부)
        //         if(freRes) {
        //             let delObj = dblChk(freRes, deleteArr);
        //             // delObj는 삭제할 배열, DB에서 삭제
        //             let result ;
        //             for(var i=0; i<delObj.length; i++) {
        //                 result = await fresh.destroy({
        //                     where : {
        //                         user_user_id : final_user_id,
        //                         fresh_name : delObj[i].name
        //                     }
        //                 })
        //             }
        //             console.log("freshtb 삭제 결과: ", result);
        //         }

        //     }
        //     // 삭제할 요소와 froRes와 동일할 때
        //     if(deleteArr.length === froRes.length) {
        //         console.log("삭제할 요소와 froRes가 같아요");
        //         if(froRes) {
        //             let delObj = dblChk(froRes, deleteArr);
        //             // delObj는 삭제할 배열, DB에서 삭제
        //             let result ;
        //             for(var i=0; i<delObj.length; i++) {
        //                 result = await frozen.destroy({
        //                     where : {
        //                         user_user_id : final_user_id,
        //                         frozen_name : delObj[i].name
        //                     }
        //                 })
        //             }
        //         }
        //     }
        // }
       
        // 결과
    //     if(freRes && froRes.length == 0) { // fresh 테이블에만 있는 경우
    //         console.log("ingdRange : ", ingdRange);
    //         console.log("ingdName : ", ingdName);
    //         console.log("freRes : ", freRes);

    //         // freRes에 deleteArr가 있는 경우 그냥 바로 삭제
    //         freRes = freRes.filter(item => {
    //             return !deleteArr.some(other => other.name === item.name);
    //         })
    //         // 삭제해야할 filterDelfre와 겹치는 것은 삭제하기 위해 delObj에 넣어준다.
    //         let freResStr = JSON.stringify(freRes);
    //         let delObj = deleteArr.filter(item => {
    //             return freResStr.indexOf(JSON.stringify(item))
    //         })
    //         console.log("delObj",delObj);

    //         let result ; 
    //         for(var i=0; i<freRes.length; i++){
    //             let data = { fresh_range : ingdRange[i]};
    //             result = await fresh.update(data, {
    //                 where : {
    //                     user_user_id : final_user_id,
    //                     fresh_name : ingdName[i]
    //                 }
    //             })
    //         }
    //         console.log("수정 결과: ", result);
    //         res.send(result);
    //     }else if(froRes && freRes.length == 0) { // frozen 테이블에만 있는 경우
    //         let result;
    //         for(var i=0; i<froRes.length; i++){
    //             let data = { frozen_name : ingdRange[i]};
    //             result = await frozen.update(data, {
    //                 where : {
    //                     user_user_id : final_user_id,
    //                     frozen_name : ingdName[i]
    //                 }
    //             })
    //         }

    //         console.log(result);
    //         res.send(result);
    //     }else if(froRes.length>0 && freRes.length>0) { // fresh 테이블과 frozen테이블 둘 다 있는 경우
    //         // let freshRes ;  // fresh 결과 담을 변수
    //         // let frozenRes; // frozen 결과 담을 변수
    //         // console.log("freRes 결과 : ", freRes);
    //         // console.log("froRes 결과 : ", froRes);
    //         // console.log("freRes[0].range", freRes[0].range);
    //         // console.log("froRes[0].range", froRes[0].range);

    //         let freshRes;
    //         if(freRes){ // fresh 결과가 있을 때
    //             for(var i=0; i<freRes.length; i++){
    //                 let data = { fresh_range : ingdRange[i]};
    //                 freshRes = await fresh.update(data, {
    //                     where : {
    //                         user_user_id : final_user_id,
    //                         fresh_name : freRes[i].name,
    //                     }
    //                 })
    //             }
    //         }
    //         let frozenRes;
    //         if(froRes){ // frozen 결과가 있을 때
    //             for(var i=0; i<froRes.length; i++){
    //                 let data = { frozen_range : ingdRange[i]};
    //                 frozenRes = await frozen.update(data, {
    //                     where : {
    //                         user_user_id : final_user_id,
    //                         frozen_name : froRes[i].name,
    //                     }
    //                 })
    //             }
    //         }
    //         console.log(freshRes, frozenRes);
    //         res.send(freshRes, frozenRes);
    //     }
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