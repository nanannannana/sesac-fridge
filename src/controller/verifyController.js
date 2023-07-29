const { verifyService } = require("../service");
const utils = require("../misc/utils");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const verifyController = {
  async getVerifyId(req, res, next) {
    try {
      const user = await verifyService.getUserById(req.params.id);
      if (!user) {
        return res
          .status(200)
          .send(utils.buildResponse(null, "사용 가능한 이메일 입니다."));
      }

      next(
        new AppError(
          commonErrors.resourceDuplicationError,
          403,
          "이메일이 중복됩니다."
        )
      );
      return;
    } catch (error) {
      next(error);
    }
  },
};

module.exports = verifyController;
