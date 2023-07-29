const { Recipe, Log, CookLog, RecipeLike, Fresh, Frozen } = require("../model");
const { Op } = require("sequelize");

const recipeController = {
  // 요리하기 버튼 눌렀을 때 fresh DB와 frozen DB에 해당 식재료 range 수정 및 삭제
  async patchToFridge(req, res) {
    // 삭제할 배열이 있을 때 삭제를 먼저 하고 나서 업데이트
    // delArr : 삭제할 배열
    let delArr = req.body.filter((item) => {
      return item.delMust === "1";
    });
    let delValFromFresh; // fresh 테이블에서 삭제한 결과 값
    let delValFromFrozen; // frozen 테이블에서 삭제한 결과 값
    let updateValFromFresh; // fresh 테이블에서 수정한 결과 값
    let updateValFromFrozen; // frozen 테이블에서 수정한 결과 값

    // [1] 삭제할 배열이 있을 때
    // 받은 데이터로 fresh table과 frozen table에서 일치하는 값을 찾아서 삭제
    if (delArr.length > 0) {
      let delName = []; // 삭제할 이름

      delArr.forEach((item) => {
        delName.push(item.name);
      });

      // freRes : fresh table에서 삭제해야 할 것
      let freRes = await Fresh.findAll({
        raw: true,
        attributes: [["fresh_name", "name"]],
        where: { user_user_id: req.session.user, fresh_name: delName },
      });

      // fresh테이블에서 나온 결과만 있을 때 fresh테이블에서 삭제
      if (freRes.length > 0) {
        for (var i = 0; i < freRes.length; i++) {
          delValFromFresh = await Fresh.destroy({
            where: {
              user_user_id: req.session.user,
              fresh_name: delName,
            },
          });
        }
      }

      // frozen테이블에서 나온 결과도 있을 때 frozen 테이블에서 삭제
      if (freRes.length != delArr.length) {
        let froRes = await Frozen.findAll({
          raw: true,
          attributes: [["frozen_name", "name"]],
          where: { user_user_id: req.session.user, frozen_name: delName },
        });
        for (var i = 0; i < froRes.length; i++) {
          delValFromFrozen = await Frozen.destroy({
            where: {
              user_user_id: req.session.user,
              frozen_name: froRes[i].name,
            },
          });
        }
      }
    }

    // [2] 업데이트 할 배열이 있을 때
    // updateArr : 업데이트할 배열
    let updateArr = req.body.filter((item) => {
      return !item.delMust;
    });

    let ingdName = []; // 업데이트 할 재료 이름
    let ingdRange = []; // 업데이트 할 재료 비율

    updateArr.forEach((item) => {
      ingdName.push(item.name);
      ingdRange.push(item.range);
    });

    if (updateArr.length > 0) {
      let freRes = await Fresh.findAll({
        raw: true,
        attributes: [
          ["fresh_name", "name"],
          ["fresh_range", "range"],
        ],
        where: { user_user_id: req.session.user, fresh_name: ingdName },
      });

      // freRes에 있는 ingdName과 같은 것 == fresh tb에서 수정할 때 필요한 이름
      let freIngdName = ingdName.filter((item) => {
        return freRes.some((other) => other.name === item);
      });

      // freRes과 같지 않은 것 ==> frozen에 있는 IngdName == frozen에서 수정할 때 필요한 이름
      // froIngdName이 없다면 frozen tb에서 삭제할 것이 xx
      let froIngdName = ingdName.filter((item) => {
        return !freRes.some((other) => other.name === item);
      });

      // fresh테이블에서 나온 결과가 있을 때 fresh테이블에서 바로 수정
      if (freRes.length > 0) {
        for (var i = 0; i < freRes.length; i++) {
          let data = { fresh_range: 50 };
          updateValFromFresh = await Fresh.update(data, {
            where: {
              user_user_id: req.session.user,
              fresh_name: freIngdName[i],
            },
          });
        }
      }
      // frozen table에서 삭제해야 할 게 남아있을 때 frozen에서 select 한 후 업데이트
      if (freRes.length != updateArr.length) {
        let froRes = await Frozen.findAll({
          raw: true,
          attributes: [
            ["frozen_name", "name"],
            ["frozen_range", "range"],
          ],
          where: { user_user_id: req.session.user, frozen_name: ingdName },
        });

        // frozen table에서 수정
        for (var i = 0; i < froRes.length; i++) {
          let data = { frozen_range: 50 };
          updateValFromFrozen = await Frozen.update(data, {
            where: {
              user_user_id: req.session.user,
              frozen_name: froIngdName[i],
            },
          });
        }
      }
    }

    // 모든 결과 값들
    if (
      updateValFromFresh ||
      updateValFromFrozen ||
      delValFromFresh === 0 ||
      delValFromFresh === 1 ||
      delValFromFrozen === 0 ||
      delValFromFrozen === 1
    ) {
      res.send(true);
    }
  },

  // 최근에 본 레시피
  async postInsertToLog(req, res) {
    // 같은 레시피 id가 존재하면 log DB에 create 하지 않음
    let [find, create] = await Log.findOrCreate({
      where: { recipe_recipe_id: req.body.id },
      defaults: {
        recipe_recipe_id: req.body.id,
        user_user_id: req.session.user,
      },
    });
    // find해서 create 하지 못해도 true넘기고, create해도 true
    if (create || find) res.send(true);
  },

  // 최근에 한 요리
  async postInsertToCookLog(req, res) {
    // 같은 레시피 id가 존재하면 log DB에 create 하지 않음
    let [find, create] = await CookLog.findOrCreate({
      where: { recipe_recipe_id: req.body.id },
      defaults: {
        recipe_recipe_id: req.body.id,
        user_user_id: req.session.user,
      },
    });
    console.log("최근에 한 요리 create: ", create);
    console.log("최근에 한 요리 find: ", find);

    // find해서 create 하지 못해도 true 넘기고, create해도 true
    if (create || find) res.send(true);
  },

  // 좋아요 추가
  async postInsertToLike(req, res) {
    // recipe tb에 컬럼 수정
    await Recipe.update(
      { recipe_pick: 1 },
      { where: { recipe_id: req.body.id } }
    );

    // 같은 레시피 id와 유저가 존재하면 recipe_like DB에 create 하지 않음
    let [find, create] = await RecipeLike.findOrCreate({
      where: { recipe_recipe_id: req.body.id, user_user_id: req.session.user },
      defaults: {
        recipe_recipe_id: req.body.id,
        user_user_id: req.session.user,
      },
    });
    if (create) {
      // 생성 시
      res.send(create);
    } else {
      res.send(find);
    }
  },

  // 좋아요 삭제
  async deleteFromLike(req, res) {
    let result = await RecipeLike.destroy({
      where: {
        recipe_recipe_id: req.body.id,
        user_user_id: req.session.user,
      },
    });

    console.log("좋아요 삭제 결과: ", result);
    res.send(String(result));
  },
};

module.exports = recipeController;
