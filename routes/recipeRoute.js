const express = require("express");
const recipe = require("../controller/recipe/recipe");
const router = express.Router();


// 레시피 페이지 렌더 - 지향
router.get("/", recipe.getRecipe);

// 요리하기 버튼 추가 시 fridge에 update할 정보
router.patch("/toFridge", recipe.patchToFridge);

// 최근 본 레시피 (log 테이블에 저장) 
router.post("/insertToLog", recipe.postInsertToLog);
// 최근 한 요리 (cooklog 테이블에 저장)
router.post("/insertToCookLog", recipe.postInsertToCookLog)
// 좋아요 저장 (recipe_like 테이블에 저장)
router.post("/insertToLike", recipe.postInsertToLike);
// 좋아요 삭제 
router.delete("/deleteFromLike", recipe.deleteFromLike)


// router.get("/fromFridge", recipe.getFromFridge);

module.exports = router;