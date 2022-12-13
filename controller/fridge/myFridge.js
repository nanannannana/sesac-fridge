
// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = (req,res) => {
    res.render("fridge/myFridge");
}

exports.postResultRecipe = (req,res) => {
    // exports.postResultRecipe = async (req,res) => {
    console.log( "req.body.checkedIngdList : ", req.body.checkedIngdList );
    res.send(true);
}