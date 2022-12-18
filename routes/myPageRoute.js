const express = require("express");
const myPage = require("../controller/user/myPage");
const router = express.Router();

// 마이페이지 렌더 - 예지
router.post("/", myPage.postMyPage);
router.post("/chart", myPage.postMyPageChart);
// 찜리스트 렌더
router.post("/wishList", myPage.postWishList);
router.delete("/wishListDel", myPage.deleteWishListDel);
// 회원정보 수정 전 비밀번호 확인
router.post("/profile", myPage.postPwInput);
router.post("/profilePwConfirm", myPage.postPwConfirm);
// 회원정보 렌더
router.post("/profile/myInfo", myPage.postMyInfo);
// 회원정보 수정
router.patch("/profile/myInfo", myPage.patchMyInfoUpdate);
// 회원정보 수정 확인
router.post("/profile/myInfoCheck", myPage.postMyInfoCheck);
// 회원탈퇴 렌더
router.post("/profile/myInfoDel", myPage.postMyInfoDel);
// 회원탈퇴 완료
router.delete("/profile/myInfoDel", myPage.deleteMyInfoDel);

module.exports = router;