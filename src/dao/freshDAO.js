const { Fresh } = require("../model");

const freshDAO = {
  async findAllByUserId(user_user_id) {
    const fresh_ingds = await Fresh.findAll({
      raw: true,
      where: { user_user_id },
    });

    return fresh_ingds;
  },

  async findAndCountAllByUserId(user_user_id) {
    const fresh_ingredients = await Fresh.findAndCountAll({
      where: { user_user_id },
    });
    return fresh_ingredients;
  },
};

module.exports = freshDAO;
