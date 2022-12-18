const { user } = require("../../model/");
const { fresh } = require("../../model/");
const { frozen } = require("../../model/");
const { recipe_like } = require("../../model/");
const { recipe } = require("../../model/");
const { log } = require("../../model/");

// 마이 페이지 렌더 - 예지
exports.postMyPage = async function(req,res) {
    var fresh_count = await fresh.findAndCountAll();
    var fresh_result = await fresh.findAll();
    var frozen_count = await frozen.findAndCountAll();
    var frozen_result = await frozen.findAll();
    let recipe_tag_count = await log.findAndCountAll({
        include: [
            {
                model: recipe,
                required: true,
                attributes: ["recipe_tag"]
            }
        ],
        where: {user_user_id: req.session.user}
    });
    let recipe_tag = await log.findAll({
        raw: true,
        include: [
            {
                model: recipe,
                required: true,
                attributes: ["recipe_tag"]
            }
        ],
        where: {user_user_id: req.session.user},
        limit: 10
    });
    var ingd_name = [];
    for (var i=0 ; i < fresh_count.count ; i++) {
        ingd_name.push(fresh_result[i].fresh_name);
    }
    for (var k=0 ; k < frozen_count.count ; k++) {
        ingd_name.push(frozen_result[k].frozen_name);
    }
    var recipe_tag_list = [];
    for (var j = 0; j < recipe_tag_count.count ; j++) {
        if (recipe_tag[j]['recipe.recipe_tag']==null) {
            recipe_tag_list.push("기타");
        } else {
            recipe_tag_list.push(recipe_tag[j]['recipe.recipe_tag']);
        }
    }
    res.render("user/myPage", {
        ingd_name: ingd_name,
        recipe_tag: recipe_tag_list
    });
}
exports.postMyPageChart = function(req,res) {
    const ingd_name_list = req.body.ingd_name.split(",");
    const recipe_tag_list = req.body.recipe_tag.split(",");
    // console.log(ingd_name_list);
    res.send([ingd_name_list,recipe_tag_list]);
}

// 찜리스트 렌더
exports.postWishList = async function(req,res) {
    // join조건에 부합한 row count
    let rec_like_count = await recipe_like.findAndCountAll({
        include: [
            {
                model: recipe,
                required: true,
                attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"]
            }
        ],
        where: {user_user_id: req.session.user}
    });
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
    for (var i=0 ; i < rec_like_count.count ; i++) {
        recipe_id.push(rec_like[i].recipe.recipe_id);
        recipe_img.push(rec_like[i].recipe.recipe_img);
        recipe_url.push(rec_like[i].recipe.recipe_url);
        recipe_title.push(rec_like[i].recipe.recipe_title);
    }
    res.render("user/wishList", {
        recipe_id: recipe_id,
        recipe_img: recipe_img,
        recipe_title: recipe_title,
        recipe_url: recipe_url
    });
}
// 찜리스트 정보 삭제
exports.deleteWishListDel = async function(req,res) {
    let result = await recipe_like.findAll({where: {recipe_recipe_id: req.body.recipe_id}});
    let like_id = result[0].like_id;
    await recipe_like.destroy({where:{like_id: like_id}});
    let rec_like_count = await recipe_like.findAndCountAll({
        include: [
            {
                model: recipe,
                required: true,
                attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"]
            }
        ],
        where: {user_user_id: req.session.user}
    });
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
    for (var i=0 ; i < rec_like_count.count ; i++) {
        recipe_id.push(rec_like[i].recipe.recipe_id);
        recipe_img.push(rec_like[i].recipe.recipe_img);
        recipe_url.push(rec_like[i].recipe.recipe_url);
        recipe_title.push(rec_like[i].recipe.recipe_title);
    }
    res.send({recipe_id, recipe_img, recipe_url, recipe_title});
}


// 회원정보 수정 전 비밀번호 확인
exports.postPwInput = function(req,res) {
    res.render("user/pwConfirm", {user_id: req.session.user});
    console.log(req.session.user);
}
exports.postPwConfirm = async function(req,res) {
    let result = await user.findAll({where: {user_id: req.body.user_id, user_pw: req.body.user_pw}});
    if (result.length>0) res.send(true)
    else res.send(false);
}
// 회원정보 수정 페이지 렌더
exports.postMyInfo = async function(req,res) {
    let result = await user.findAll({where: {user_id: req.body.user_id}});
    console.log(result[0]);
    res.render("user/myInfo", {
        user_id: result[0].user_id,
        user_pw: result[0].user_pw,
        user_name: result[0].user_name,
        user_phone: result[0].user_phone
    });
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
    let fresh_count = await fresh.findAndCountAll();
    let frozen_count = await frozen.findAndCountAll();
    res.render("user/myInfoDel", {
        user_id: req.body.user_id,
        ingd_count: fresh_count.count+frozen_count.count
    });
}
// 회원탈퇴 완료
exports.deleteMyInfoDel = async function(req,res) {
    await user.destroy({where: {user_id: req.body.user_id}});
    res.send(true);
}