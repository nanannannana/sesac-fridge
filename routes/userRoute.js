const express = require("express");
const user = require("../controller/user/user");
const router = express.Router();

// 로그인 렌더 - 예지
// localhost:8080/signin 
router.get("/signIn", user.getSignin);
// 로그인 확인
router.post("/signinFlag",user.postSigninFlag);
// 회원가입 렌더
router.get("/signUp",user.getSignup);
// 중복아이디 확인
router.post("/idCheck",user.postIdCheck);
// 회원가입 성공
router.post("/signupFlag",user.postSignupFlag);

module.exports = router;