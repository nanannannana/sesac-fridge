const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더 - 예지
router.get("/", myPage.getMyPage);
// 찜리스트 렌더
router.get("/wishList", myPage.getWishList);
// 회원정보 렌더
router.get("/profile", myPage.getProfileStart);
// 회원정보 수정
router.get("/profileEdit", myPage.getProfileEdit);

module.exports = router;