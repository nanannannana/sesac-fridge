const express = require("express");
const myFridge = require("../controller/fridge/myFridge");
const router = express.Router();

// 나의 냉장고 페이지 렌더 - 영은
router.get("/", myFridge.getMyFridge);

// 선택한 식재료 포함된 레시피 산출 - 영은
router.post("/resultRecipe", myFridge.postResultRecipe);

module.exports = router;