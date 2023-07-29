const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");

const authMiddleware = {
  isAuthenticated(req, res, next) {
    if (!req.session.user) {
      next(
        new AppError(
          commonErrors.authenticationError,
          401,
          "로그인 후 이용해주세요."
        )
      );
      return;
    }
    next();
  },
};

module.exports = authMiddleware;
