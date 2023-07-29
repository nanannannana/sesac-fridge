const express = require("express");
const verifyRouter = express.Router();
const { verifyController } = require("../controller");

verifyRouter.get("/:id", verifyController.getVerifyId);

module.exports = verifyRouter;
