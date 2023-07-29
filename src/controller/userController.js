const { userService, verifyService } = require("../service");
const utils = require("../misc/utils");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const axios = require("axios");

const userController = {
  async postSignUp(req, res, next) {
    try {
      const { user_id, user_pw, user_name, user_phone } = req.body;
      const existingId = await verifyService.getUserById(user_id);

      if (!existingId) {
        await userService.createUser({
          user_id,
          user_pw,
          user_name,
          user_phone,
        });
        return res
          .status(200)
          .send(utils.buildResponse(null, "회원가입이 완료되었습니다."));
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

  async patchUpdateUser(req, res, next) {
    try {
      await userService.updateUser(req.session.user, req.body);
      return res
        .status(200)
        .send(utils.buildResponse(null, "회원 수정이 완료되었습니다."));
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.session.user);
      req.session.destroy((error) => {
        if (err) next(error);
      });

      return res
        .status(200)
        .send(utils.buildResponse(null, "회원 탈퇴가 완료되었습니다."));
    } catch (error) {
      next(error);
    }
  },

  async postFindAccount(req, res, next) {
    try {
      const { user_name, user_phone, user_id } = req.body;
      if (user_name) {
        const user = await userService.findAccount({
          user_name,
          user_phone,
        });

        if (user) {
          return res
            .status(200)
            .send(
              utils.buildResponse(
                { user_id: user.user_id, user_name: user.user_name },
                "아이디 찾기 완료."
              )
            );
        } else {
          next(
            new AppError(
              commonErrors.inputError,
              400,
              "일치하는 아이디가 존재하지 않습니다."
            )
          );
          return;
        }
      }

      const user = await userService.findAccount({ user_id, user_phone });
      if (user) {
        const temp_password = Math.random().toString(36);
        await userService.updateUser(user_id, { user_pw: temp_password });
        const status_code = await userService.send_message(user, temp_password);
        console.log("result_code", status_code);
        if (status_code == 202) {
          return res
            .status(200)
            .send(utils.buildResponse(null, "비밀번호 SNS 발송 완료"));
        } else {
          next(
            new AppError(
              commonErrors.internalServerError,
              status_code,
              "서버 내부 오류가 발생했습니다."
            )
          );
          return;
        }
      }

      next(
        new AppError(
          commonErrors.inputError,
          400,
          "일치하는 비밀번호가 존재하지 않습니다."
        )
      );
      return;
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { access_token, user } = req.session;
      if (access_token) {
        await axios
          .post("https://kapi.kakao.com/v1/user/unlink", null, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(async (response) => {
            if (response.status == 200) {
              await userService.deleteUser(user);
              req.session.destroy((error) => {
                if (error) next(error);
              });
              return res.clearCookie("sesac_fridge_id").redirect("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      }

      await userService.deleteUser(user);
      req.session.destroy((error) => {
        if (error) next(error);
        return res.clearCookie("sesac_fridge_id").redirect("/");
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
