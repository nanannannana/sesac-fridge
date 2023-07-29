const { recipeDAO } = require("../dao");

const recipeService = {
  async findPopularRecipes() {
    const popular_recipes = await recipeDAO.findFour();
    return popular_recipes;
  },
};

module.exports = recipeService;
