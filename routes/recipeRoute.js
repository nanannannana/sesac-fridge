const express = require("express");
const recipe = require("../controller/recipe/recipe");
const router = express.Router();


// 레시피 페이지 렌더 - 지향
router.get("/", recipe.getRecipe);
// 최근 본 레시피 (log 테이블에 저장) 
router.post("/insertToLog", recipe.postInsertToLog);


module.exports = router;