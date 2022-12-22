const { user } = require("../../model/");

// 로그인 페이지 렌더
exports.getSignin = function(req,res) {
    res.render("user/signIn");
}
// 로그인 확인
exports.postSigninFlag = async function(req,res) {
    let result = await user.findAll({where:{user_id:req.body.user_id, user_pw: req.body.user_pw}});
    console.log(req.body);
    if (result.length>0) {
        req.session.user = req.body.user_id;
        const option = {
            httpOnly: true,
            maxAge: 3*24*60*60*1000 //3일 뒤 자동로그인 설정 만료
        };
        // 자동로그인
        if (req.body.remember_me_check==1) {
            res.cookie("user_id",req.body.user_id,option); //서버에서 쿠키 생성 => 클라이언트로 보내기
            res.send({result: true, username: result[0].user_name});
        } else {
            res.send({result: true, username: result[0].user_name});
        }
    } else {
        res.send(false);
    }
}

//아이디 비밀번호 찾기
exports.postIdFind = async function(req,res) {
    let result = await user.findAll({
        where: {
            user_name: req.body.user_name,
            user_phone: req.body.user_phone
        }
    });
    if (result[0]===undefined) {
        res.send("undefined");
    } else {
        res.send(result[0]);
    }
}
exports.postPwFind = async function(req,res) {
    let result = await user.findAll({
        where: {
            user_id: req.body.user_id,
            user_phone: req.body.user_phone
        }
    });
    console.log(result[0]);
    if (result[0]===undefined) {
        res.send("undefined");
    } else {
        res.send(result[0]);
    }
}

// 회원가입 페이지 렌더
exports.getSignup = function(req,res) {
    res.render("user/signUp");
}

// 아이디 중복 확인
exports.postIdCheck = async function(req,res) {
    // let data = {user_id: req.body.user_id};
    let result = await user.findAll({where:{user_id: req.body.user_id}});
    if (result.length>0) res.send(false)
    else res.send(true);
}

// 회원가입 성공
exports.postSignupUpdate = async function(req,res) {
    let result = await user.findAll({where:{user_id: req.body.user_id}});
    let data = {
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
        user_name: req.body.user_name,
        user_phone: req.body.user_phone
    }
    if (result.length>0) {
        res.send(false);
    } else {
        await user.create(data);
        res.send(true);
    }
}
//로그아웃
exports.postSignOut = function(req,res) {
    //쿠키 삭제
    const option = {
        httpOnly: true,
        maxAge: 0,
    }
    res.cookie("user_id",null,option);
    // 세션 삭제
    req.session.destroy(function(err) {
        if (err) throw err;
        res.send(true);
    })
}