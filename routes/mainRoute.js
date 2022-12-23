const express = require("express");
const main = require("../controller/main/main");
const router = express.Router();

// 메인 페이지 렌더 - 영은
router.get("/", main.getMain);
// 유통기한 지난 식재료 삭제 - 영은
router.delete("/deleteAlert", main.deleteDeleteAlert);

router.post("/fridgeList", main.postFridgeList);










module.exports = router;