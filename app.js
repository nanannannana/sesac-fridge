const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
dotenv.config();

// ejs 등록
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/static", express.static("static"));

app.use(cookieParser());

app.use(
  session({
    secret: "111",
    resave: false,
    saveUninitialized: true,
  })
);

// 라우터 등록
const mainRouter = require("./routes/mainRoute"); // 메인
const fridgeRouter = require("./routes/fridgeRoute"); // 냉장고
const recipeRouter = require("./routes/recipeRoute"); // 레시피
const myPageRouter = require("./routes/myPageRoute"); // 마이페이지
const userRouter = require("./routes/userRoute"); // 유저(로그인, 회웍가입 등)

app.use("/", mainRouter);
app.use("/myFridge", fridgeRouter);
app.use("/recipe", recipeRouter);
app.use("/myPage", myPageRouter);
app.use("/", userRouter);

// swagger
const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("*", (req, res) => {
  res.render("./main/404");
});

app.listen(process.env.PORT, () => {
  console.log("server open : ", process.env.PORT);
});
