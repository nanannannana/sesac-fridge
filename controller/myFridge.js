
// 나의 냉장고 페이지 렌더 - 영은
exports.getMyFridge = (req,res) => {
    res.render("myFridge");
}

exports.postResultRecipe = (req,res) => {
    // exports.getResultRecipe = async (req,res) => {
    // let result = await Recipe.findAll({
    //     attributes : [""],
    //     where : {}
    // });
    console.log( "req.query.checkedIngdList : ", req.query.checkedIngdList );
    res.send(true);
}