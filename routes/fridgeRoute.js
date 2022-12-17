const express = require("express");
const myFridge = require("../controller/fridge/myFridge");
const router = express.Router();

// 나의 냉장고 페이지 렌더 - 영은
router.get("/", myFridge.getMyFridge);

// 선택한 식재료 포함된 레시피 산출 - 영은
router.post("/resultRecipe", myFridge.postResultRecipe);

// 식재료 존재 여부 확인
router.post("/checkFresh", myFridge.postCheckFresh);
router.post("/checkFrozen", myFridge.postCheckFrozen);

// 식재료 냉장고 추가
router.post("/addToFresh", myFridge.postAddToFresh);
router.post("/addToFrozen", myFridge.postAddToFrozen);

// 식재료 입력값 수정
router.patch("/updateFresh", myFridge.patchUpdateFresh);
router.patch("/updateFrozen", myFridge.patchUpdateFrozen);

// 냉장고에서 식재료 제거
router.delete("/deleteIngd", myFridge.deleteDeleteIngd);


module.exports = router;