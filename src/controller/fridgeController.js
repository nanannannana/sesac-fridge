const { Fresh, Frozen } = require("../model");

const fridgeController = {
  // 빈 냉장고 알림 Cookie
  async postEmptyAlertCookie(req, res) {
    let exp_date = new Date();
    exp_date.setHours(23, 59, 59);

    res.cookie("EMPTY_ALERT", "1", {
      httpOnly: true,
      expires: exp_date,
    });
    res.send(true);
  },

  // 냉장실 입력한 식재료 중복여부 확인
  async postCheckFresh(req, res) {
    console.log("postCheckFresh req.body:", req.body);
    let result = await Fresh.findOne({
      where: {
        user_user_id: req.session.user,
        fresh_name: req.body.name,
      },
    });
    console.log("checkFresh result : ", result);
    res.send(result ? false : true);
  },

  // 냉동실 입력한 식재료 중복여부 확인
  async postCheckFrozen(req, res) {
    console.log("postCheckFrozen req.body:", req.body);
    let result = await Frozen.findOne({
      where: {
        user_user_id: req.session.user,
        frozen_name: req.body.name,
      },
    });
    console.log("checkFrozen result : ", result);
    res.send(result ? false : true);
  },

  // 냉장실에 새로운 식재료 추가
  async postAddToFresh(req, res) {
    console.log("postAddToFresh req.body : ", req.body);
    let data = {
      fresh_name: req.body.name,
      fresh_range: req.body.range,
      fresh_expire: req.body.expire,
      fresh_category: req.body.category,
      user_user_id: req.session.user,
    };
    let result = await Fresh.create(data);
    console.log("postAddToFresh result : ", result);
    res.send(result);
  },

  // 냉동실에 새로운 식재료 추가
  async postAddToFrozen(req, res) {
    console.log("postAddToFrozen req.body : ", req.body);
    let data = {
      frozen_name: req.body.name,
      frozen_date: req.body.date,
      frozen_range: req.body.range,
      user_user_id: req.session.user,
    };
    let result = await Frozen.create(data);
    console.log("postAddToFrozen result : ", result);
    res.send(result);
  },

  // 냉장실 식재료 수정
  async patchUpdateFresh(req, res) {
    console.log("patchUpdateFresh req.body : ", req.body);
    console.log("req.name", req.body.name);
    let data = {
      fresh_range: req.body.range,
      fresh_expire: req.body.expire,
    };

    let result = await Fresh.update(data, {
      where: {
        user_user_id: req.session.user,
        fresh_name: req.body.name,
      },
    });

    console.log("update result : ", result);
    res.send(result);
  },

  // 냉동실 식재료 수정
  async patchUpdateFrozen(req, res) {
    console.log("patchUpdateFrozen req.body : ", req.body);
    let data = {
      frozen_date: req.body.date,
      frozen_range: req.body.range,
    };
    let result = await Frozen.update(data, {
      where: {
        user_user_id: req.session.user,
        frozen_name: req.body.name,
      },
    });
    console.log("update result : ", result);
    res.send(result);
  },

  // 식재료 삭제
  async deleteDeleteIngd(req, res) {
    console.log("postDeleteIngd req.body : ", req.body);

    if (req.body.fridgeName == "fresh") {
      let result = await Fresh.destroy({
        where: {
          user_user_id: req.session.user,
          fresh_name: req.body.name,
        },
      });
      console.log("delete result : ", result);
      res.send(req.body);
    } else {
      let result = await Frozen.destroy({
        where: {
          user_user_id: req.session.user,
          frozen_name: req.body.name,
        },
      });
      console.log("delete result : ", result);
      res.send(req.body);
    }
  },
};

module.exports = fridgeController;
