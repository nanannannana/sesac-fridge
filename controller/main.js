
// 메인 페이지 렌더 - 주안
exports.getMain = (req,res) => {
    res.render("main");
}

// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = (req,res) => {
    res.render("myFridge");
}
