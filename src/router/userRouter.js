const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controller");
const { authMiddleware } = require("../middleware");

userRouter.post("/", userController.postSignUp);
userRouter.patch(
  "/",
  authMiddleware.isAuthenticated,
  userController.patchUpdateUser
);
userRouter.delete(
  "/",
  authMiddleware.isAuthenticated,
  userController.deleteUser
);
userRouter.post("/find-account", userController.postFindAccount);

module.exports = userRouter;
