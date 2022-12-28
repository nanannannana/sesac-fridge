const { recipe,log,cooklog,recipe_like } = require("../../model");
const { fresh } = require("../../model");
const { frozen } = require("../../model");

const { Op } = require("sequelize");  // where 안에 조건절을 위해

// 영은, 냉장고에서 선택한 식재료 list(join한 문자열 상태) 전역변수로 받음 ------ getRecipe [2]-1-2에서 사용 
let fridgeList;
exports.getFromFridge = async (req,res) => {
    fridgeList = req.query.fridgeList;
    res.send(true);  
}

// 레시피 추천 페이지 유저 갖고 있는 재료 기준으로
exports.getRecipe = async (req, res) => {

    // [1]-1 좋아요한 레시피를 구분하기 위해서(로그인시, 비로그인시 둘다 필요)
    // 로그인 했을 때, 냉장고 재
    let likeUser = await recipe_like.findAll({
        raw : true,
        attributes : [['user_user_id', "userId"], ['recipe_recipe_id', 'recipeId'], ['like_id', 'likeId']],
    })

    if(req.session.user || req.cookies.user_id) {
        const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
        console.log("유저 : ", final_user_id);

        // [1] fresh 테이블과 frozen 테이블의 모든 재료를 findAll로 가져온다.
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

        // [1]-2 fresh, frozen 테이블에서 검색한 결과를 합쳐서 ingdRes에 넣는다.
        let ingdRes = [];

        freRes.forEach((item)=>{
            ingdRes.push(item);
        })
        froRes.forEach((item)=>{
            ingdRes.push(item);
        }) 

        let ingdName = [];  // 식재료
        let ingdRange = []; // 수량

        // [1]-3 식재료 이름, 수량을 각각 ingdName과 ingdRange에 집어넣기
        for(var i=0;i<ingdRes.length;i++){
        ingdName.push(ingdRes[i].name + "");
        ingdRange.push(ingdRes[i].range);
        }
        console.log("ingdName : ", ingdName);
        console.log("ingdRange : ", ingdRange);
        
        // [1]-4 정확하게 일치하는 재료를 찾기 위해서 ingName을 문자열로
        let ingdNameStr = ingdName.join(",|,"); 
 
        // [1]-5 더 광범위한 재료 포함 할 때 ex 파 검색 => 쪽파, 대파, 양파 같이
        let bigIngdNameStr = ingdNameStr.replace(/,/g, ""); 

        // 식재료가 있을 때 일치하는 식재료가 있으면 보여준다.
        let where = {}; // 레시피에서 검색할 때 사용할 where 절
        // [2]-1 식재료가 있을 때
        if(ingdRes.length > 0){ 

            let result;
            let recipes;
            // [2]-1-1 검색어로 렌더
            if(req.query.keyword){
                console.log("키워드렌더입니다.")
                console.log("키워드", req.query.keyword)
                recipes = await recipe.findAll({
                    raw : true,
                    where : { ["recipe_ingd"] : { [Op.regexp] : req.query.keyword}}
                })
            }
            // [2]-1-2 나의 냉장고에서 선택한 식재료로 렌더, 영은
            if(req.query.fridge){
                console.log("냉장고렌더입니다");
                console.log("냉장고", fridgeList );

                recipes = await recipe.findAll({
                    raw : true,
                    where : {["recipe_ingd"] : {[Op.regexp] : fridgeList }}
                })
            }
            // [2]-1-3 빠른한끼 태그로 렌더
            if(req.query.tag == "빠른한끼") {
                console.log("빠른한끼렌더입니다.");
                recipes = await recipe.findAll({
                    raw : true,
                    where : {["recipe_ingd"] : {[Op.regexp] : ingdNameStr}},
                    order : [
                        [ 'recipe_time', 'ASC']
                    ],
                    limit : 45
                })
            }
            // [2]-1-4 식재료일치 태그로 렌더
            if(req.query.tag === "식재료일치") {
                console.log("식재료 일치렌더입니다.")
                recipes = await recipe.findAll({
                    raw : true,
                    where : {["recipe_ingd"] : {[Op.regexp] : ingdNameStr }},
                })
            }
            // [2]-1-5 페이지네이션 있을 때
            if(req.query.page) {
                let pageNum = req.query.page; // 요청 페이지 넘버
                let offset = 0;
                where["recipe_ingd"] = { [Op.regexp] : bigIngdNameStr}; 
                if(req.query.tag) {
                    where["recipe_tag"] = req.query.tag;
                }
                if(pageNum > 1) {
                    offset = 20 * (pageNum -1); 
                }
                let result = await recipe.findAndCountAll({
                    raw : true, 
                    offset : offset,
                    limit : 20
                })
                console.log("페이지 렌더 결과", result);
            }
            // [2]-1-6 기본 렌더
            if(req.query.tag != "빠른한끼" && req.query.tag != "식재료일치" && !req.query.keyword && !req.query.fridge ) { 
                console.log("기본렌더입니다.")
                // 식재료랑 비슷하게 일치하는 레시피가 있을 때,
                where["recipe_ingd"] = { [Op.regexp] : bigIngdNameStr}; 
                if(req.query.tag) {
                    where["recipe_tag"] = req.query.tag;
                }
                recipes = await recipe.findAll({
                    raw : true, // dataValues만 가져오기
                    where,
                    limit : 20
                });
            }
            
            result = { data: recipes, dataLike : likeUser }; 

            // [2]-1-7 식재료가 있을 때 프론트 단에서 사용할 나의 재료 이름과 수량
            let ingdResult = []; 
            for(var i=0; i<recipes.length;i++) {
                ingdResult.push(recipes[i].recipe_ingd);
            }
            
            result["ingdName"] = ingdName;
            result["ingdRange"] = ingdRange;
            result["ingdResult"] = ingdResult;
            result["isLogin"] = true;
            result["user_id"] = final_user_id;
            if(req.query.tag) {

                result["tag"] = req.query.tag;
            }else { 
                result["tag"] = "유사 재료 레시피";
            }

            console.log("식재료 냉장고 결과", result.ingdName)


            res.render("recipe/recipe", result);
        } else { // [2]-2 로그인 했는데 식재료가 없을 때(냉장고 빈 것 포함)
            let result;
            let recipes;
            // [2]-2-1 로그인 시 식재료 없을 때 기본 렌더
            if(req.query.tag != "빠른한끼" && !req.query.keyword) { 
                console.log("로그인, 식재료 없는 기본 렌더");
                let where ={};
                if(req.query.tag) {
                    where["recipe_tag"] = req.query.tag;
                }else {
                    where["recipe_tag"] = null;
                }
                recipes = await recipe.findAll({
                    raw : true, // dataValues만 가져오기
                    where
                });
            }
            // [2]-2-2 로그인 시 식재료 없을 때 빠른 한끼 렌더
            if(req.query.tag == "빠른한끼") { 
                console.log("로그인, 식재료 없는 빠른 한끼 태그")
                recipes = await recipe.findAll({
                    raw : true,
                    order : [ [ 'recipe_time', 'ASC'] ],
                    limit : 45
                })
            } 
            // [2]-2-3 로그인 시 식재료 없을 때 검색어로 렌더
            if(req.query.keyword) { 
                console.log("로그인, 식재료 없는 검색어 렌더")
                recipes = await recipe.findAll({
                    raw : true,
                    where : { ["recipe_ingd"] : {[Op.regexp] : req.query.keyword}}
                })
            }
            result = { data: recipes, dataLike : likeUser }; 
            result["isLogin"] = true;
            result["user_id"] = final_user_id;
            if(req.query.tag) {
                result["tag"] = req.query.tag;
            }else {
                result["tag"] = "추천레시피";
            }
            res.render("recipe/recipe_non", result);
        }
        
    }else { // [3] 비로그인 시 
        // [3]-1 비로그인 시 기본 렌더
        let result;
        let recipes;
        if(req.query.tag != "빠른한끼" && !req.query.keyword) { 
            console.log("비로그인시 기본 렌더");
            let where ={};

            if(req.query.tag) {
                where["recipe_tag"] = req.query.tag;
            }else {
                where["recipe_tag"] = null;
            }

            recipes = await recipe.findAll({
                raw : true, // dataValues만 가져오기
                where
            });
        }
        // [3]-2 비로그인 시 빠른 한끼 렌더
        if(req.query.tag == "빠른한끼") { 
            console.log("비로그인시 빠른 한끼 태그")
            recipes = await recipe.findAll({
                raw : true,
                order : [ [ 'recipe_time', 'ASC'] ],
                limit : 45
            })
        } 
        // [3]-3 비로그인 시 검색어로 렌더
        if(req.query.keyword) { 
            console.log("비로그인시 검색어 렌더")
            recipes = await recipe.findAll({
                raw : true,
                where : { ["recipe_ingd"] : {[Op.regexp] : req.query.keyword}}
            })
        }
        result = { data: recipes, dataLike : likeUser }; 
        result["isLogin"] = false;
        if(req.query.tag) {
            result["tag"] = req.query.tag;
        }else {
            result["tag"] = "추천레시피";
        }
        res.render("recipe/recipe_non", result);
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
                let result;
                for(var i=0; i<freRes.length; i++) {
                    result = await fresh.destroy({
                        where : {
                            user_user_id : final_user_id,
                            fresh_name : delName
                        }
                    })
                    console.log("fresh 삭제 결과: ", result);
                }
                if (result) res.send(String(result)); 
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
                let result;
                for(var i=0;i<froRes.length;i++) {
                    result = await frozen.destroy({
                        where : {
                            user_user_id : final_user_id,
                            frozen_name : froRes[i].name
                        }
                    })
                    console.log("frozen 삭제 결과: ", result);
                }
                if(result) res.send(String(result));
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

            // freRes과 같지 않은 것 ==> frozen에 있는 IngdName == frozen에서 수정할 때 필요한 이름
            let froIngdName = ingdName.filter(item => {
                return !freRes.some(other => other.name === item);
            })
            console.log("froIngdName", froIngdName);

            // fresh테이블에서 나온 결과가 있을 때 fresh테이블에서 바로 수정
            let freResult;
            if(freRes.length > 0 ) {
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
                if (froIngdName.length<1) res.send(freResult); // frozen테이블에 없는 경우 send 
            }
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

// 최근에 한 요리
exports.postInsertToCookLog = async (req,res) => {
    const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
    // 같은 레시피 id가 존재하면 log DB에 create 하지 않음
    let [find, create] = await cooklog.findOrCreate({
        where : { recipe_recipe_id : req.body.id },
        defaults : {
            recipe_recipe_id : req.body.id,
            user_user_id : final_user_id,
        }
    });
    console.log("최근에 한 요리 create: ", create)
    console.log("최근에 한 요리 find: ", find)
    
    // find해서 create 하지 못해도 true 넘기고, create해도 true
    if( create || find ) res.send(true);
}

// 좋아요 추가
let likeUser = "";
exports.postInsertToLike = async (req,res) => {

    const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;
    // recipe tb에 컬럼 수정
    let result = await recipe.update(
        {recipe_pick : 1},
        {where : { recipe_id : req.body.id }}
    )  

    // 같은 레시피 id와 유저가 존재하면 recipe_like DB에 create 하지 않음
    let [find, create] = await recipe_like.findOrCreate({
        where : { recipe_recipe_id : req.body.id, user_user_id : final_user_id },
        defaults : {
            recipe_recipe_id : req.body.id,
            user_user_id : final_user_id,
        }
    })
    if(create) { // 생성 시 
        res.send(create);
    }else {
        res.send(find);
    }
}

// 좋아요 삭제
exports.deleteFromLike = async (req,res) => {
    
    const final_user_id = (req.cookies.user_id === undefined) ? req.session.user : req.cookies.user_id;

    let result = await recipe_like.destroy({
        where : { 
            recipe_recipe_id : req.body.id, 
            user_user_id : final_user_id 
        }
    })

    console.log("좋아요 삭제 결과: ", result);
    res.send(String(result));
}