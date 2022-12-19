const express = require("express");
const main = require("../controller/main/main");
const router = express.Router();

// 메인 페이지 렌더 - 영은
router.get("/", main.getMain);
// 쿠키 생성
router.post("/modalCookie", main.postModalCookie);



module.exports = router;