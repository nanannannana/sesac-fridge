const { user } = require("../../model/");

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
exports.postMyInformation = async function(req,res) {
    let result = await user.findAll({where: {user_id: req.body.user_id}});
    console.log(result[0].user_pw);
    res.render("user/myInformation", {
        user_id: result[0].user_id,
        user_name: result[0].user_name,
        user_phone: result[0].user_phone
    });
}

// 회원정보 수정
exports.postProfileEdit = function(req,res) {
    res.render("user/profileEdit");
}
// 회원탈퇴 렌더
exports.postProfileDel = function(req,res) {
    res.render("user/profileDel");
}
exports.deleteProfileDel = function(req,res) {
    res.send(true);
}