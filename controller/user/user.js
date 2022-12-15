// 로그인 페이지 렌더
exports.getSignin = function(req,res) {
    res.render("user/signIn");
}
exports.postSignin = function(req,res) {
    console.log(req.body);
    res.send(true);
}

// 회원가입 페이지 렌더
exports.getSignup = function(req,res) {
    res.render("user/signUp");
}
exports.postSignup = function(req,res) {
    console.log(req.body);
    res.send(true);
}
