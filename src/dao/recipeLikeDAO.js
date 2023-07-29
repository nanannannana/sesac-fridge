const { RecipeLike, Recipe } = require("../model");

const recipeLikeDAO = {
  async destroy(recipe_recipe_id) {
    await RecipeLike.destroy({ where: { recipe_recipe_id } });
    return;
  },

  async findAllByUserId(user_user_id) {
    const wishList = await RecipeLike.findAll({
      raw: true,
      attributes: { exclude: ["like_id", "user_user_id", "recipe_recipe_id"] },
      include: [
        {
          model: Recipe,
          required: true,
          attributes: ["recipe_id", "recipe_url", "recipe_img", "recipe_title"],
        },
      ],
      where: { user_user_id },
    });

    return wishList;
  },
};

module.exports = recipeLikeDAO;
