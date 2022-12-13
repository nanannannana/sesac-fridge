// 마이 페이지 렌더 - 예지
exports.getMyPage = function(req,res) {
    res.render("user/myPage");
}
exports.getWishList = function(req,res) {
    res.render("user/wishList");
}
exports.getProfileStart = function(req,res) {
    res.render("user/profileStart")
}
exports.getProfileEdit = function(req,res) {
    res.render("user/profileEdit")
}