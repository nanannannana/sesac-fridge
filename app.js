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
const userRouter = require("./routes/userRoute");     // 유저

app.use("/", mainRouter);
app.use("/myFridge", fridgeRouter);
app.use("/recipe", recipeRouter);
app.use("/myPage", userRouter);


app.get("*", (req,res)=>{
    res.render("404");
})

app.listen(port, ()=>{
    console.log("server open : ", port);
})