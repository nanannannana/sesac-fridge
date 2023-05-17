const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더
router.post("/", myPage.postMyPage);
router.post("/chart", myPage.postMyPageChart);

// 찜리스트 렌더
router.post("/wishlist", myPage.postWishList);
router.delete("/wishlist", myPage.deleteWishList);

// 회원정보 수정 전 비밀번호 확인
router.post("/password", myPage.postShowCheckPassword);
router.post("/password/check", myPage.postCheckPassword);

// 회원정보 렌더
router.post("/profile", myPage.postShowProfile);
// 회원정보 수정
router.patch("/profile", myPage.patchUpdateProfile);
// 회원탈퇴 렌더
router.post("/profile/withdrawal", myPage.postShowUserWithdrawal);

module.exports = router;
