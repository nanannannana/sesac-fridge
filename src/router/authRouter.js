const express = require("express");
const authRouter = express.Router();
const { authController } = require("../controller");
const { authMiddleware } = require("../middleware");

authRouter.post("/login", authController.postLogin);
authRouter.get(
  "/logout",
  authMiddleware.isAuthenticated,
  authController.getLogout
);
authRouter.get("/kakao-login", authController.getSocialLogin);
authRouter.post("/kakao-login", authController.postSocialLogin);

module.exports = authRouter;
