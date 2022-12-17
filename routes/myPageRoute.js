const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더 - 예지
router.get("/", myPage.getMyPage);
// 찜리스트 렌더
router.get("/wishList", myPage.getWishList);
// 회원정보 수정 전 비밀번호 확인
router.get("/profile", myPage.getPwConfirm);
router.post("/profile", myPage.postPwConfirm);
// 회원정보 렌더
router.post("/profile/myInformation", myPage.postMyInformation);
// 회원정보 수정
router.post("/profileEdit", myPage.postProfileEdit);
// 회원탈퇴 렌더
router.post("/profileDel", myPage.postProfileDel);
// 회원탈퇴 완료
router.delete("/profileDel", myPage.deleteProfileDel);

module.exports = router;