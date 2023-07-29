const { Recipe } = require("../model");

const recipeDAO = {
  async findOneByRecipeId(recipe_id) {
    const recipePickCount = await Recipe.findOne({
      raw: true,
      attributes: ["recipe_pick"],
      where: { recipe_id },
    });

    return recipePickCount.recipe_pick;
  },

  async updateRecipePickCount(recipe_pick, recipe_id) {
    await Recipe.update({ recipe_pick }, { where: { recipe_id } });
    return;
  },

  async findFour() {
    const popular_recipes = await Recipe.findAll({
      raw: true,
      order: [["recipe_pick", "desc"]],
      limit: 4,
    });
    return popular_recipes;
  },
};

module.exports = recipeDAO;
