const { fresh } = require("../../model");
const { frozen } = require("../../model");
const { recipe } = require("../../model"); 


// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = async (req,res) => {
    if(req.session.user || req.cookies.user_id){ //로그인 후 
        const final_user_id = (req.cookies.user_id===undefined) ? req.session.user : req.cookies.user_id;
        let fresh_result = await fresh.findAndCountAll({
            where : {user_user_id : final_user_id},
            order : [["fresh_expire", "ASC"]]
        });
    
        let frozen_result = await frozen.findAndCountAll({
            where : {user_user_id : final_user_id},
            order : [["frozen_date", "ASC"]]
        });
        // console.log("list :", fresh_result.count, frozen_result.count );
        if(req.cookies.EMPTY_ALERT==1){  //로그인 O & 오늘안봄클릭 O
            res.render("fridge/myFridge", {
                isLogin : true,
                fresh_list : fresh_result.rows, 
                frozen_list : frozen_result.rows,
                empty_alert : true
            });
        }else{
            res.render("fridge/myFridge", { //로그인 O & 오늘안봄클릭 X
                isLogin : true,
                fresh_list : fresh_result.rows, 
                frozen_list : frozen_result.rows,
                empty_alert : false
            });
        }
    }else{ //로그인 X
        // res.render("fridge/myFridge404", {isLogin : false});
        res.render("main/first_main", { isLogin : false });
    }  
}

// 빈 냉장고 알림 Cookie
exports.postEmptyAlertCookie = async (req,res) => {
    let exp_date = new Date(); 
    exp_date.setHours(23,59,59);

    if(req.session.user){
        res.cookie("EMPTY_ALERT","1", {
            httpOnly : true,
            expires : exp_date,
        });
        res.send(true);
    }
}

// 냉장실 입력한 식재료 중복여부 확인 
exports.postCheckFresh = async (req, res)=>{
    console.log("postCheckFresh req.body:", req.body);
        let result = await fresh.findOne({
            where : {
                user_user_id : req.session.user,
                fresh_name : req.body.name
            }
        });
        console.log("checkFresh result : ", result );
        if(result===null){ res.send(true);}
        else{ res.send(false);}    
}

// 냉동실 입력한 식재료 중복여부 확인 
exports.postCheckFrozen = async (req, res)=>{
    console.log("postCheckFrozen req.body:", req.body);
        let result = await frozen.findOne({
            where : {
                user_user_id : req.session.user,
                frozen_name : req.body.name
            }
        });
        console.log("checkFrozen result : ", result );
        if(result===null){ res.send(true);}
        else{ res.send(false);}
}

// 냉장실에 새로운 식재료 추가
exports.postAddToFresh = async (req,res)=>{
    console.log( "postAddToFresh req.body : ", req.body );
        let data = {
            fresh_name : req.body.name,
            fresh_range : req.body.range,
            fresh_expire : req.body.expire,
            fresh_category : req.body.category,
            user_user_id : req.session.user
        }
    let result = await fresh.create(data);
    console.log( "postAddToFresh result : ", result);
    res.send( result );
}

// 냉동실에 새로운 식재료 추가
exports.postAddToFrozen = async (req,res)=>{
    console.log( "postAddToFrozen req.body : ", req.body );
        let data = {
            frozen_name : req.body.name,
            frozen_date : req.body.date,
            frozen_range : req.body.range,
            user_user_id : req.session.user
        }
    let result = await frozen.create(data);
    console.log( "postAddToFrozen result : ", result);
    res.send( result );
}

// 냉장실 식재료 수정
exports.patchUpdateFresh = async (req,res)=>{
    console.log("patchUpdateFresh req.body : ", req.body);
    let data = {
        fresh_range : req.body.range,
        fresh_expire : req.body.expire    
    }
    let result = await fresh.update(data, {
        where : {
            user_user_id : req.session.user,
            fresh_name : req.body.name}
    })
    console.log( 'update result : ', result );
    res.send(result);
}
// 냉동실 식재료 수정
exports.patchUpdateFrozen = async (req,res)=>{
    console.log("patchUpdateFrozen req.body : ", req.body);
    let data = {
        frozen_date : req.body.date,
        frozen_range : req.body.range    
    }
    let result = await frozen.update(data, {
        where : {
            user_user_id : req.session.user,
            frozen_name : req.body.name
        }
    })
    console.log( 'update result : ', result );
    res.send(result);
}

// 식재료 삭제
exports.deleteDeleteIngd = async (req,res)=>{
    console.log( "postDeleteIngd req.body : ", req.body);

    if(req.body.fridgeName == "fresh"){
        let result = await fresh.destroy({ 
            where : {
                user_user_id : req.session.user,
                fresh_name : req.body.name
            }
        });
        console.log('delete result : ', result);
        res.send( req.body);
    }else{ let result = await frozen.destroy({
            where : { 
                user_user_id : req.session.user,
                frozen_name : req.body.name
            }
        });
        console.log('delete result : ', result);
        res.send( req.body);
    }
    
}