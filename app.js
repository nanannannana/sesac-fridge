const express = require("express");
const app = express();
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config(); 

app.use("/static", express.static("static"));
app.use(session({
    secret: "111",
    resave: false,
    saveUninitialized: true
}));

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

// DB 연결 성공 여부
const {sequelize} = require('./model/index'); 
// 다른 require문은 일단 생략
const ConnectDB = async () => {
    try {
        await sequelize.authenticate().then( 
            () => console.log('데이터베이스 연결 성공!')
        );
        await sequelize.sync().then(
            () => console.log('동기화 완료!')
        );
    } catch (error) {
        console.error('DB 연결 및 동기화 실패', error);
    }
}
// DB와 연결 및 동기화
ConnectDB();

app.listen(process.env.PORT, ()=>{
    console.log("server open : ", process.env.PORT);
})