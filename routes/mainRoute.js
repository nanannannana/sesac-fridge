const express = require("express");
const main = require("../controller/main/main");
const router = express.Router();

// 메인 페이지 렌더 - 주안
router.get("/", main.getMain);
// 쿠키 생성
router.post("/postCookie", main.postCookie);



module.exports = router;