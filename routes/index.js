const express = require("express");
const main = require("../controller/main");
const myFridge = require("../controller/myFridge");
const myPage = require("../controller/myPage");
const router = express.Router();

// 메인 페이지 렌더 - 주안
router.get("/", main.getMain);

// 나의 냉장고 페이지 렌더 - 영은
router.get("/myFridge", myFridge.getMyFridge);
// 선택한 식재료 포함된 레시피 산출 - 영은
router.post("/resultRecipe", myFridge.postResultRecipe);

// 마이페이지 - 예지
router.get("/myPage", myPage.getMyPage);




module.exports = router;