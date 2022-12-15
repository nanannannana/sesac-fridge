// 마이 페이지 렌더 - 예지
exports.getMyPage = function(req,res) {
    res.render("user/myPage");
}
// 찜리스트 렌더
exports.getWishList = function(req,res) {
    res.render("user/wishList");
}
// 회원정보 렌더
exports.getProfileStart = function(req,res) {
    res.render("user/profileStart")
}
// 회원정보 수정
exports.postProfileEdit = function(req,res) {
    res.render("user/profileEdit")
}
// 회원탈퇴 렌더
exports.postProfileDel = function(req,res) {
    res.render("user/profileDel");
}
exports.deleteProfileDel = function(req,res) {
    res.send(true);
}