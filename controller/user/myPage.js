const { user } = require("../../model/");
const { fresh } = require("../../model/");
const { frozen } = require("../../model/");
const { recipe_like } = require("../../model/");
const { recipe } = require("../../model/");
const { log } = require("../../model/");
const { cooklog } = require("../../model/");

// 마이 페이지 렌더 - 예지
exports.postMyPage = async function(req,res) {
    if (req.cookies.user_id) {
        req.session.user = req.cookies.user_id;
        var fresh_result = await fresh.findAll({
            raw:true
        });
        let cook_result = await cooklog.findAll({
            raw: true,
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_tag", "recipe_title","recipe_url","recipe_img"]
                }
            ],
            where: {user_user_id: req.session.user},
            order: [['cooklog_id', 'DESC']],
            limit: 10
        });
        console.log("cookresult:", cook_result[0]['recipe.recipe_title']);
        let recipe_result = await log.findAll({
            raw: true,
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_title","recipe_url","recipe_img"],
                }
            ],
            where: {user_user_id: req.session.user},
            order: [['log_id', 'DESC']],
            limit: 4
        })
        console.log("recipe_result:",recipe_result[0]['recipe.recipe_title']);
        // 냉장고 카테고리 배열
        var fresh_category_list = [];
        for (var i=0; i<fresh_result.length ; i++) {
            fresh_category_list.push(fresh_result[i].fresh_category);
        }
        // 최근에 한 요리 차트 관련 배열
        var cook_tag_list = [];
        for (var j = 0; j < cook_result.length ; j++) {
            if (cook_result[j]['recipe.recipe_tag']==null) {
                cook_tag_list.push("기타");
            } else {
                cook_tag_list.push(cook_result[j]['recipe.recipe_tag']);
            }
        }
        //최근에 한 요리/최근 본 레시피 카드 관련 배열
        var cook_title_list = [];
        var cook_url_list = [];
        var cook_img_list = [];
        var recipe_title_list = [];
        var recipe_url_list = [];
        var recipe_img_list = [];
        for (var l=0 ; l < cook_result.length ; l++) {
            cook_title_list.push(cook_result[l]['recipe.recipe_title']);
            cook_url_list.push(cook_result[l]['recipe.recipe_url']);
            cook_img_list.push(cook_result[l]['recipe.recipe_img']);
        }
        for (var m=0 ; m <recipe_result.length ; m++) {
            recipe_title_list.push(recipe_result[m]['recipe.recipe_title']);
            recipe_url_list.push(recipe_result[m]['recipe.recipe_url']);
            recipe_img_list.push(recipe_result[m]['recipe.recipe_img']);
        }
        res.render("user/myPage", {
            isLogin: true,
            fresh_category: fresh_category_list,
            cook_tag: cook_tag_list,
            cook_title: cook_title_list,
            cook_url: cook_url_list,
            cook_img: cook_img_list,
            recipe_title: recipe_title_list,
            recipe_url: recipe_url_list,
            recipe_img: recipe_img_list
        });
    } else if(req.session.user) {
        var fresh_result = await fresh.findAll({
            raw:true
        });
        let cook_result = await cooklog.findAll({
            raw: true,
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_tag", "recipe_title","recipe_url","recipe_img"]
                }
            ],
            where: {user_user_id: req.session.user},
            order: [['cooklog_id', 'DESC']],
            limit: 10
        });
        console.log("cookresult:", cook_result[0]['recipe.recipe_title']);
        let recipe_result = await log.findAll({
            raw: true,
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_title","recipe_url","recipe_img"],
                }
            ],
            where: {user_user_id: req.session.user},
            order: [['log_id', 'DESC']],
            limit: 4
        })
        console.log("recipe_result:",recipe_result[0]['recipe.recipe_title']);
        // 냉장고 카테고리 배열
        var fresh_category_list = [];
        for (var i=0; i<fresh_result.length ; i++) {
            fresh_category_list.push(fresh_result[i].fresh_category);
        }
        // 최근에 한 요리 차트 관련 배열
        var cook_tag_list = [];
        for (var j = 0; j < cook_result.length ; j++) {
            if (cook_result[j]['recipe.recipe_tag']==null) {
                cook_tag_list.push("기타");
            } else {
                cook_tag_list.push(cook_result[j]['recipe.recipe_tag']);
            }
        }
        //최근에 한 요리/최근 본 레시피 카드 관련 배열
        var cook_title_list = [];
        var cook_url_list = [];
        var cook_img_list = [];
        var recipe_title_list = [];
        var recipe_url_list = [];
        var recipe_img_list = [];
        for (var l=0 ; l < cook_result.length ; l++) {
            cook_title_list.push(cook_result[l]['recipe.recipe_title']);
            cook_url_list.push(cook_result[l]['recipe.recipe_url']);
            cook_img_list.push(cook_result[l]['recipe.recipe_img']);
        }
        for (var m=0 ; m <recipe_result.length ; m++) {
            recipe_title_list.push(recipe_result[m]['recipe.recipe_title']);
            recipe_url_list.push(recipe_result[m]['recipe.recipe_url']);
            recipe_img_list.push(recipe_result[m]['recipe.recipe_img']);
        }
        res.render("user/myPage", {
            isLogin: true,
            fresh_category: fresh_category_list,
            cook_tag: cook_tag_list,
            cook_title: cook_title_list,
            cook_url: cook_url_list,
            cook_img: cook_img_list,
            recipe_title: recipe_title_list,
            recipe_url: recipe_url_list,
            recipe_img: recipe_img_list
        });
    } else {
        res.render("user/myPage", {
            isLogin: false,
            fresh_category: fresh_category_list,
            cook_tag: cook_tag_list,
            cook_title: cook_title_list,
            cook_url: cook_url_list,
            cook_img: cook_img_list,
            recipe_title: recipe_title_list,
            recipe_url: recipe_url_list,
            recipe_img: recipe_img_list
        })
    }
}
exports.postMyPageChart = function(req,res) {
    const fresh_category_list = req.body.fresh_category.split(",");
    const cook_tag_list = req.body.cook_tag.split(",");
    // console.log(ingd_name_list);
    res.send([fresh_category_list,cook_tag_list]);
}

// 찜리스트 렌더
exports.postWishList = async function(req,res) {
    if (req.cookies.user_id) {
        req.session.user = req.cookies.user_id;
        let rec_like = await recipe_like.findAll({
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"]
                }
            ],
            where: {user_user_id: req.session.user}
        });
        // join문 결과 확인
        // console.log(rec_like_count.count);
        // console.log(rec_like[i].recipe);
        var recipe_id = [];
        var recipe_img = [];
        var recipe_url = [];
        var recipe_title = [];
        for (var i=0 ; i < rec_like.length ; i++) {
            recipe_id.push(rec_like[i].recipe.recipe_id);
            recipe_img.push(rec_like[i].recipe.recipe_img);
            recipe_url.push(rec_like[i].recipe.recipe_url);
            recipe_title.push(rec_like[i].recipe.recipe_title);
        }
        res.render("user/wishList", {
            isLogin: true,
            recipe_id: recipe_id,
            recipe_img: recipe_img,
            recipe_title: recipe_title,
            recipe_url: recipe_url
        });
    } else if(req.session.user) {
        let rec_like = await recipe_like.findAll({
            include: [
                {
                    model: recipe,
                    required: true,
                    attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"]
                }
            ],
            where: {user_user_id: req.session.user}
        });
        var recipe_id = [];
        var recipe_img = [];
        var recipe_url = [];
        var recipe_title = [];
        for (var i=0 ; i < rec_like.length ; i++) {
            recipe_id.push(rec_like[i].recipe.recipe_id);
            recipe_img.push(rec_like[i].recipe.recipe_img);
            recipe_url.push(rec_like[i].recipe.recipe_url);
            recipe_title.push(rec_like[i].recipe.recipe_title);
        }
        res.render("user/wishList", {
            isLogin: true,
            recipe_id: recipe_id,
            recipe_img: recipe_img,
            recipe_title: recipe_title,
            recipe_url: recipe_url
        });
    } else {
        res.render("user/wishList", {
            isLogin: false,
            recipe_id: recipe_id,
            recipe_img: recipe_img,
            recipe_title: recipe_title,
            recipe_url: recipe_url
        });
    }
}
// 찜리스트 정보 삭제
exports.deleteWishListDel = async function(req,res) {
    let result = await recipe_like.findAll({where: {recipe_recipe_id: req.body.recipe_id}});
    let like_id = result[0].like_id;
    await recipe.update({recipe_pick : 0},{ where : { recipe_id : req.body.recipe_id}});
    await recipe_like.destroy({where:{like_id: like_id}});
    let rec_like = await recipe_like.findAll({
        include: [
            {
                model: recipe,
                required: true,
                attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"]
            }
        ],
        where: {user_user_id: req.session.user}
    });
    var recipe_id = [];
    var recipe_img = [];
    var recipe_url = [];
    var recipe_title = [];
    for (var i=0 ; i < rec_like.length ; i++) {
        recipe_id.push(rec_like[i].recipe.recipe_id);
        recipe_img.push(rec_like[i].recipe.recipe_img);
        recipe_url.push(rec_like[i].recipe.recipe_url);
        recipe_title.push(rec_like[i].recipe.recipe_title);
    }
    res.send({recipe_id, recipe_img, recipe_url, recipe_title});
}


// 회원정보 수정 전 비밀번호 확인
exports.postPwInput = function(req,res) {
    if (req.cookies.user_id) {
        req.session.user = req.cookies.user_id;
        res.render("user/pwConfirm", {
            isLogin:true,
            user_id: req.session.user
        });
        console.log(req.session.user);
    } else if(req.session.user) {
        res.render("user/pwConfirm", {
            isLogin:true,
            user_id: req.session.user
        });
    } else {
        res.render("user/pwConfirm", {
            isLogin: false,
            user_id: req.session.user
        });
        console.log(req.session.user);
    }
}
exports.postPwConfirm = async function(req,res) {
    let result = await user.findAll({where: {user_id: req.body.user_id, user_pw: req.body.user_pw}});
    if (result.length>0) res.send(true)
    else res.send(false);
}
// 회원정보 수정 페이지 렌더
exports.postMyInfo = async function(req,res) {
    if (req.cookies.user_id) {
        req.session.user = req.cookies.user_id;
        let result = await user.findAll({where: {user_id: req.body.user_id}});
        console.log(result[0]);
        res.render("user/myInfo", {
            isLogin: true,
            user_id: result[0].user_id,
            user_pw: result[0].user_pw,
            user_name: result[0].user_name,
            user_phone: result[0].user_phone
        });
    } else if(req.session.user) {
        let result = await user.findAll({where: {user_id: req.body.user_id}});
        console.log(result[0]);
        res.render("user/myInfo", {
            isLogin: true,
            user_id: result[0].user_id,
            user_pw: result[0].user_pw,
            user_name: result[0].user_name,
            user_phone: result[0].user_phone
        });
    }else {
        res.render("user/myInfo", {
            isLogin: false,
            user_id: result[0].user_id,
            user_pw: result[0].user_pw,
            user_name: result[0].user_name,
            user_phone: result[0].user_phone
        });
    }
}
// 회원정보 수정
exports.patchMyInfoUpdate = async function(req,res) {
    let data = {
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
        user_name: req.body.user_name,
        user_phone: req.body.user_phone
    };
    await user.update(data, {where: {user_id: req.body.user_id}});
    res.send(true);
}
// 회원정보 수정 확인
exports.postMyInfoCheck = function(req,res) {
    res.send(true);
}
// 회원탈퇴 렌더
exports.postMyInfoDel = async function(req,res) {
    if (req.cookies.user_id) {
        req.session.user = req.cookies.user_id;
        let fresh_count = await fresh.findAndCountAll();
        let frozen_count = await frozen.findAndCountAll();
        res.render("user/myInfoDel", {
            isLogin: true,
            user_id: req.body.user_id,
            ingd_count: fresh_count.count+frozen_count.count
        });
    } else if(req.session.user) {
        let fresh_count = await fresh.findAndCountAll();
        let frozen_count = await frozen.findAndCountAll();
        res.render("user/myInfoDel", {
            isLogin: true,
            user_id: req.body.user_id,
            ingd_count: fresh_count.count+frozen_count.count
        });
    } else {
        res.render("user/myInfoDel", {
            isLogin: false,
            user_id: req.body.user_id,
            ingd_count: fresh_count.count+frozen_count.count
        });
    }
}
// 회원탈퇴 완료
exports.deleteMyInfoDel = async function(req,res) {
    await user.destroy({where: {user_id: req.body.user_id}});
    res.send(true);
}