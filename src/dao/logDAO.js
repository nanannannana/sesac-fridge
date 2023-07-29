const { Log, Recipe } = require("../model");

const logDAO = {
  async findAllByUserId(user_user_id) {
    const recently_viewed_recipes = await Log.findAll({
      raw: true,
      include: [
        {
          model: Recipe,
          required: true,
          attributes: ["recipe_title", "recipe_url", "recipe_img"],
        },
      ],
      where: { user_user_id },
      order: [["log_id", "DESC"]],
      limit: 4,
    });

    return recently_viewed_recipes;
  },
};

module.exports = logDAO;
