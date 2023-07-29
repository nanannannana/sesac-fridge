const express = require("express");
const renderRouter = express.Router();
const { commonController } = require("../controller");
const { authMiddleware } = require("../middleware");

renderRouter.get("/", commonController.renderMain);
renderRouter.get("/login", commonController.renderLogin);
renderRouter.get("/sign-up", commonController.renderSignUp);
renderRouter.get(
  "/myfridge",
  authMiddleware.isAuthenticated,
  commonController.renderMyFridge
);
renderRouter.get("/recipe", commonController.renderRecipe);
renderRouter.get(
  "/mypage",
  authMiddleware.isAuthenticated,
  commonController.renderMyPage
);
renderRouter.get(
  "/mypage/wishlist",
  authMiddleware.isAuthenticated,
  commonController.renderWishList
);
renderRouter.get(
  "/mypage/check-password",
  authMiddleware.isAuthenticated,
  commonController.renderCheckPassword
);
renderRouter.get(
  "/mypage/profile",
  authMiddleware.isAuthenticated,
  commonController.renderProfile
);
renderRouter.get(
  "/mypage/withdrawal",
  authMiddleware.isAuthenticated,
  commonController.renderWithdrawal
);

module.exports = renderRouter;
