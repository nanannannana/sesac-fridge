const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더
router.get("/", myPage.getMyPage);
router.get("/chart", myPage.getMyPageChart);

// 찜리스트 렌더
router.get("/wishlist", myPage.getWishList);
router.delete("/wishlist", myPage.deleteWishList);

// 회원정보 수정 전 비밀번호 확인
router.get("/password", myPage.getShowCheckPassword);
router.post("/password/check", myPage.postCheckPassword);

// 회원정보 렌더
router.get("/profile", myPage.getShowProfile);

// 회원탈퇴 렌더
router.get("/profile/withdrawal", myPage.getShowUserWithdrawal);

module.exports = router;
