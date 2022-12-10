const express = require("express");
const app = express();
const port = 8080;

app.use("/static", express.static("static"));

// ejs 등록
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// 라우터 등록
const router = require("./routes");
app.use("/", router);


app.get("*", (req,res)=>{
    res.render("404");
})

app.listen(port, ()=>{
    console.log("server open : ", port);
})