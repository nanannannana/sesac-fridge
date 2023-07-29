const { CookLog, Recipe } = require("../model");

const cookLogDAO = {
  async findAllByUserId(user_user_id) {
    const cooked_dishes = await CookLog.findAll({
      raw: true,
      include: [
        {
          model: Recipe,
          required: true,
          attributes: [
            "recipe_tag",
            "recipe_title",
            "recipe_url",
            "recipe_img",
          ],
        },
      ],
      where: { user_user_id },
      order: [["cooklog_id", "DESC"]],
      limit: 10,
    });

    return cooked_dishes;
  },
};

module.exports = cookLogDAO;
