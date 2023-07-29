const {
  recipeDAO,
  recipeLikeDAO,
  freshDAO,
  cookLogDAO,
  logDAO,
  frozenDAO,
} = require("../dao");
const sequelize = require("sequelize");

const myPageService = {
  async getFreshIngds(user_id) {
    const fresh_ingredients = await freshDAO.findAllByUserId(user_id);
    const fresh_ingredients_categories = [];
    for (const ingd of fresh_ingredients) {
      fresh_ingredients_categories.push(ingd.fresh_category);
    }
    return fresh_ingredients_categories;
  },

  async getCookedDishes(user_id) {
    const cooked_dishes = await cookLogDAO.findAllByUserId(user_id);
    const cooked_dishes_categories = [];
    for (const dish of cooked_dishes) {
      if (dish["recipe.recipe_tag"]) {
        cooked_dishes_categories.push(dish["recipe.recipe_tag"]);
      } else {
        cooked_dishes_categories.push("기타");
      }
    }
    return { cooked_dishes, cooked_dishes_categories };
  },

  async getRecipes(user_id) {
    const recently_viewed_recipes = await logDAO.findAllByUserId(user_id);
    return recently_viewed_recipes;
  },

  getChartData(ingds_categories, dishes_categories) {
    // 냉장실 카테고리 문자열을 Object { "카테고리명": 개수 }로 변환
    const fresh_ingredients_categories = {};
    ingds_categories.split(",").forEach((ingd_category) => {
      if (fresh_ingredients_categories[ingd_category]) {
        fresh_ingredients_categories[ingd_category] += 1;
      } else {
        if (!ingd_category) fresh_ingredients_categories["none"] = 0;
        else fresh_ingredients_categories[ingd_category] = 1;
      }
    });

    // 최근에 한 요리 카테고리 문자열을 Object { "카테고리명": 개수 }로 변환
    const cooked_dishes_categories = {};
    dishes_categories.split(",").forEach((cooked_dish) => {
      if (cooked_dishes_categories[cooked_dish]) {
        cooked_dishes_categories[cooked_dish] += 1;
      } else {
        if (!cooked_dish) cooked_dishes_categories["none"] = 0;
        else cooked_dishes_categories[cooked_dish] = 1;
      }
    });

    return { fresh_ingredients_categories, cooked_dishes_categories };
  },

  async deleteWishList(recipe_id) {
    const recipePickCount = await recipeDAO.findOneByRecipeId(recipe_id);
    if (recipePickCount > 1) {
      await recipeDAO.updateRecipePickCount(
        sequelize.literal("recipe.recipe_pick-1"),
        recipe_id
      );
    } else {
      await recipeDAO.updateRecipePickCount(0, recipe_id);
    }
    await recipeLikeDAO.destroy(recipe_id);
    return;
  },

  async getWishList(user_id) {
    const wishList = await recipeLikeDAO.findAllByUserId(user_id);
    return wishList;
  },

  async getFreshIngdsAndCount(user_id) {
    const fresh_ingredients = await freshDAO.findAndCountAllByUserId(user_id);
    return fresh_ingredients;
  },

  async getFrozenIngdsAndCount(user_id) {
    const frozen_ingredients = await frozenDAO.findAndCountAllByUserId(user_id);
    return frozen_ingredients;
  },
};

module.exports = myPageService;
