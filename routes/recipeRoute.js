const express = require("express");
const recipe = require("../controller/recipe/recipe");
const router = express.Router();


// 레시피 페이지 렌더 - 지향
router.get("/", recipe.getRecipe);

module.exports = router;