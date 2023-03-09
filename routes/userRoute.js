const express = require("express");
const user = require("../controller/user/user");
const router = express.Router();

// 로그인 렌더 - 예지
// localhost:8080/signin
router.get("/signIn", user.getSignin);
// 로그인 확인
router.post("/signinFlag", user.postSigninFlag);
//간편로그인
// router.get('/kakao/oauth', user.kakao_token);
router.get("/signin/kakao_login", user.getKakao);
router.post("/signin/kakao_access", user.kakaoAccess);

router.get("/kakao/info", user.getKakaoInfo);
router.post("/kakao/info", user.postKakaoInfo);
// 회원가입 렌더
router.get("/signUp", user.getSignup);

// 회원가입 중복아이디 확인
router.post("/idCheck", user.postIdCheck);

// 회원가입 성공
router.post("/signupUpdate", user.postSignupUpdate);
// 아이디/비밀번호 찾기
router.post("/idFind", user.postIdFind);
router.post("/pwFind", user.postPwFind);
//로그아웃
router.post("/signOut", user.postSignOut);

module.exports = router;
