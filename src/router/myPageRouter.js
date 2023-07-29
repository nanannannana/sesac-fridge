const express = require("express");
const { myPageController } = require("../controller");
const myPageRouter = express.Router();
const { authMiddleware } = require("../middleware");

myPageRouter.get(
  "/chart",
  authMiddleware.isAuthenticated,
  myPageController.getChartData
);
myPageRouter.delete(
  "/wishlist",
  authMiddleware.isAuthenticated,
  myPageController.deleteWishList
);
myPageRouter.post(
  "/check-password",
  authMiddleware.isAuthenticated,
  myPageController.postCheckPassword
);

module.exports = myPageRouter;
