const express = require("express");
const user = require("../controller/user/user");
const router = express.Router();

// 로그인 렌더 - 예지
// localhost:8080/signin 
router.get("/signin", user.getSignin);


module.exports = router;