const { user } = require("../../model/");
const { fresh } = require("../../model/");
const { frozen } = require("../../model/");

// 마이 페이지 렌더 - 예지
exports.getMyPage = function(req,res) {
    res.render("user/myPage");
}
// 찜리스트 렌더
exports.getWishList = function(req,res) {
    res.render("user/wishList");
}
// 회원정보 수정 전 비밀번호 확인
exports.getPwConfirm = function(req,res) {
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