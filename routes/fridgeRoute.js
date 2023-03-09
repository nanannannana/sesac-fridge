const express = require('express');
const { post } = require('request');
const myFridge = require('../controller/fridge/myFridge');
const myFridgeRecipe = require('../controller/fridge/myFridgeRecipe');
const router = express.Router();
const app = express();

// 나의 냉장고 페이지 렌더 - 영은
router.get('/', myFridge.getMyFridge);
router.post('/', myFridge.postEmptyAlertCookie);

// 식재료 존재 여부 확인
router.post('/checkFresh', myFridge.postCheckFresh);
router.post('/checkFrozen', myFridge.postCheckFrozen);

// 식재료 냉장고 추가
router.post('/addToFresh', myFridge.postAddToFresh);
router.post('/addToFrozen', myFridge.postAddToFrozen);

// 식재료 입력값 수정
router.patch('/updateFresh', myFridge.patchUpdateFresh);
router.patch('/updateFrozen', myFridge.patchUpdateFrozen);

// 냉장고에서 식재료 제거
router.delete('/deleteIngd', myFridge.deleteDeleteIngd);

// 선택한 식재료 포함된 레시피 산출 - 영은
router.post('/resultRecipe', myFridgeRecipe.postResultRecipe);

router.delete('/deleteInFresh', myFridgeRecipe.deleteDeleteInFresh);
router.delete('/deleteInFrozen', myFridgeRecipe.deleteDeleteInFrozen);

module.exports = router;
