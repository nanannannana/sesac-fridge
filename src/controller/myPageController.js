const { myPageService, authService } = require("../service");
const utils = require("../misc/utils");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const myPageController = {
  async getChartData(req, res, next) {
    try {
      const { fresh_ingredients_categories, cooked_dishes_categories } =
        req.query;
      const chartData = myPageService.getChartData(
        fresh_ingredients_categories,
        cooked_dishes_categories
      );

      res
        .status(200)
        .send(utils.buildResponse(chartData, "마이페이지 차트 데이터 전송"));
    } catch (error) {
      next(error);
    }
  },

  async deleteWishList(req, res, next) {
    try {
      await myPageService.deleteWishList(req.body.recipe_id);
      const wishList = await myPageService.getWishList(req.session.user);
      res.status(200).send(utils.buildResponse(wishList, "찜 삭제 완료"));
    } catch (error) {
      next(error);
    }
  },

  async postCheckPassword(req, res, next) {
    try {
      const checkedPassword = await authService.checkUser(
        req.session.user,
        req.body.user_pw
      );
      if (checkedPassword) {
        return res
          .status(200)
          .send(utils.buildResponse(null, "비밀번호가 일치합니다."));
      }

      next(
        new AppError(
          commonErrors.authenticationError,
          400,
          "비밀번호가 일치하지 않습니다."
        )
      );
      return;
    } catch (error) {
      next(error);
    }
  },
};

module.exports = myPageController;
