const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더 - 예지
router.get("/", myPage.getMyPage);
router.get("/wishList", myPage.getWishList);
router.get("/profile", myPage.getProfileStart);
router.get("/profilEdit", myPage.getProfileEdit);

module.exports = router;