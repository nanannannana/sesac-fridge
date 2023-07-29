const express = require("express");
const { recipeController, commonController } = require("../controller");
const { authMiddleware } = require("../middleware");
const recipeRouter = express.Router();

// 요리하기 버튼 추가 시 fridge에 update할 정보
recipeRouter.patch(
  "/toFridge",
  authMiddleware.isAuthenticated,
  recipeController.patchToFridge
);
// 최근 본 레시피 (log 테이블에 저장)
recipeRouter.post(
  "/insertToLog",
  authMiddleware.isAuthenticated,
  recipeController.postInsertToLog
);
// 최근 한 요리 (cooklog 테이블에 저장)
recipeRouter.post(
  "/insertToCookLog",
  authMiddleware.isAuthenticated,
  recipeController.postInsertToCookLog
);
// 좋아요 저장 (recipe_like 테이블에 저장)
recipeRouter.post(
  "/insertToLike",
  authMiddleware.isAuthenticated,
  recipeController.postInsertToLike
);
// 좋아요 삭제
recipeRouter.delete(
  "/deleteFromLike",
  authMiddleware.isAuthenticated,
  recipeController.deleteFromLike
);
// 나의 냉장고에서 선택한 재료 fridgeList -영은
recipeRouter.get(
  "/fromFridge",
  authMiddleware.isAuthenticated,
  commonController.getFromFridge
);

module.exports = recipeRouter;
