const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const { authService, userService } = require("../service");
const utils = require("../misc/utils");

const authController = {
  async postLogin(req, res, next) {
    try {
      const { user_id, user_pw, remember_me_check } = req.body;
      const user = await authService.checkUser(user_id, user_pw);
      if (user) {
        if (remember_me_check == 1) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30일
          req.session.user = user_id;
        }

        req.session.user = user_id;
        return res.status(200).send(utils.buildResponse(null, "로그인 성공"));
      }

      next(
        new AppError(
          commonErrors.authenticationError,
          400,
          "이메일 또는 패스워드가 일치하지 않습니다."
        )
      );
      return;
    } catch (error) {
      next(error);
    }
  },

  getSocialLogin(req, res, next) {
    res.render("user/kakaoLogin");
  },

  async postSocialLogin(req, res, next) {
    try {
      const { access_token, user_id, user_name } = req.body;
      const user = await userService.getUser(user_id);

      if (!user) {
        await userService.createUser({
          user_id,
          user_name,
          social_login: "kakao",
        });
      }

      req.session.cookie.maxAge = 1 * 24 * 60 * 60 * 1000;
      req.session.user = user_id;
      req.session.access_token = access_token;
      req.session.social_login = true;

      res.status(200).send(utils.buildResponse(null, "소셜 로그인 성공"));
    } catch (error) {
      next(error);
    }
  },

  getLogout(req, res, next) {
    req.session.destroy((error) => {
      if (error) next(error);
      res.clearCookie("sesac_fridge_id").redirect("/");
    });
  },
};

module.exports = authController;
