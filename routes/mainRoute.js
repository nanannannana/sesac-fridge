const express = require("express");
const main = require("../controller/main/main");
const router = express.Router();

// 메인 페이지 렌더 - 영은
router.get("/", main.getMain);
// 유통기한 지난 식재료 삭제 - 영은
router.delete("/deleteAlert", main.deleteDeleteAlert);


// 데이터 정규화
router.get("/db", main.getDbRegex);
router.patch("/dbRegex", main.patchDbRegex);






module.exports = router;