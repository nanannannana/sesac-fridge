const { Fresh, Frozen } = require("../model");

const fridgeRecipeController = {
  // 선택한 식재료로 레시피 찾기
  async postResultRecipe(req, res) {
    console.log("req.body.checkedIngdList : ", req.body.checkedIngdList);
    console.log(req.body.checkedIngdList[0]);
    console.log("postResultRecipe result : ", result);
    res.send(true);
  },

  async deleteDeleteInFresh(req, res) {
    // fresh 테이블에서 삭제
    await Fresh.destroy({
      where: {
        user_user_id: req.session.user,
        fresh_name: req.body.name,
      },
    });
    res.send(true);
  },

  async deleteDeleteInFrozen(req, res) {
    // frozen 테이블에서 삭제
    await Frozen.destroy({
      where: {
        user_user_id: req.session.user,
        frozen_name: req.body.name,
      },
    });
    res.send(true);
  },
};

module.exports = fridgeRecipeController;
