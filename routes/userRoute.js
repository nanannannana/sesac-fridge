const express = require("express");
const user = require("../controller/user/user");
const router = express.Router();

// 로그인 렌더 - 예지
// localhost:8080/signin 
router.get("/signIn", user.getSignin);
router.post("/signIn", user.postSignin);
// 회원가입 렌더
router.get("/signUp",user.getSignup);
router.post("/signUp",user.postSignup);

module.exports = router;