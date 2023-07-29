const express = require("express");
const v1Router = express.Router();
const authRouter = require("./authRouter");
const verifyRouter = require("./verifyRouter");
const userRouter = require("./userRouter");
const fridgeRouter = require("./fridgeRouter");
const recipeRouter = require("./recipeRouter");
const myPageRouter = require("./myPageRouter");

v1Router.use("/auth", authRouter);
v1Router.use("/verify", verifyRouter);
v1Router.use("/user", userRouter);
v1Router.use("/fridge", fridgeRouter);
v1Router.use("/recipe", recipeRouter);
v1Router.use("/mypage", myPageRouter);

module.exports = {
  v1: v1Router,
};
