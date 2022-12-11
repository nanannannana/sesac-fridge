const express = require("express");
const main = require("../controller/main");
const myFridge = require("../controller/myFridge");
const router = express.Router();

// 메인 페이지 렌더 - 주안
router.get("/", main.getMain);

// 나의 냉장고 페이지 렌더 - 영은
router.get("/myFridge", myFridge.getMyFridge);


module.exports = router;