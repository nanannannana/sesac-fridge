// 로그인 페이지 렌더 - 예지
exports.getSignin = function(req,res) {
    res.render("user/signIn");
}
exports.getSignup = function(req,res) {
    res.render("user/signUp");
}
exports.postSignup = function(req,res) {
    console.log(req.body);
    res.send(true);
}
