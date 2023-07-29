const express = require("express");
const {
  fridgeController,
  fridgeRecipeController,
  commonController,
} = require("../controller");
const { authMiddleware } = require("../middleware");
const fridgeRouter = express.Router();

// 나의 냉장고 페이지 얼럿
fridgeRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  fridgeController.postEmptyAlertCookie
);

// 식재료 존재 여부 확인
fridgeRouter.post(
  "/checkFresh",
  authMiddleware.isAuthenticated,
  fridgeController.postCheckFresh
);
fridgeRouter.post(
  "/checkFrozen",
  authMiddleware.isAuthenticated,
  fridgeController.postCheckFrozen
);

// 식재료 냉장고 추가
fridgeRouter.post(
  "/addToFresh",
  authMiddleware.isAuthenticated,
  fridgeController.postAddToFresh
);
fridgeRouter.post(
  "/addToFrozen",
  authMiddleware.isAuthenticated,
  fridgeController.postAddToFrozen
);

// 식재료 입력값 수정
fridgeRouter.patch(
  "/updateFresh",
  authMiddleware.isAuthenticated,
  fridgeController.patchUpdateFresh
);
fridgeRouter.patch(
  "/updateFrozen",
  authMiddleware.isAuthenticated,
  fridgeController.patchUpdateFrozen
);

// 냉장고에서 식재료 제거
fridgeRouter.delete(
  "/deleteIngd",
  authMiddleware.isAuthenticated,
  fridgeController.deleteDeleteIngd
);

// 선택한 식재료 포함된 레시피 산출 - 영은
fridgeRouter.post(
  "/resultRecipe",
  authMiddleware.isAuthenticated,
  fridgeRecipeController.postResultRecipe
);

fridgeRouter.delete(
  "/deleteInFresh",
  authMiddleware.isAuthenticated,
  fridgeRecipeController.deleteDeleteInFresh
);
fridgeRouter.delete(
  "/deleteInFrozen",
  authMiddleware.isAuthenticated,
  fridgeRecipeController.deleteDeleteInFrozen
);

// 유통기한 지난 식재료 삭제 - 영은
fridgeRouter.delete(
  "/deleteAlert",
  authMiddleware.isAuthenticated,
  commonController.deleteDeleteAlert
);

module.exports = fridgeRouter;
