const express = require("express");
const app = express();
const port = 8080;

app.use("/static", express.static("static"));


// ejs 등록
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// 라우터 등록
const mainRouter = require("./routes/mainRoute");     // 메인
const fridgeRouter = require("./routes/fridgeRoute"); // 냉장고
const recipeRouter = require("./routes/recipeRoute"); // 레시피
const myPageRouter = require("./routes/myPageRoute");  // 마이페이지
const userRouter = require("./routes/userRoute");     // 유저(로그인, 회웍가입 등)

app.use("/", mainRouter);
app.use("/myFridge", fridgeRouter);
app.use("/recipe", recipeRouter);
app.use("/myPage", myPageRouter);
app.use("/", userRouter);

app.get("*", (req,res)=>{
    res.render("./main/404");
})

app.listen(port, ()=>{
    console.log("server open : ", port);
})