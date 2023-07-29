const { Frozen } = require("../model");

const frozenDAO = {
  async findAndCountAllByUserId(user_user_id) {
    const frozen_ingredients = await Frozen.findAndCountAll({
      where: { user_user_id },
    });
    return frozen_ingredients;
  },
};

module.exports = frozenDAO;
