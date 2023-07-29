const { userDAO, oauthDAO } = require("../dao");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const axios = require("axios");

const userService = {
  async createUser({ user_id, user_pw, user_name, user_phone, social_login }) {
    if (user_pw) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(user_pw, salt);
      user_pw = hash;
    }
    await userDAO.create({ user_id, user_pw, user_name, user_phone });

    if (social_login) {
      await oauthDAO.create(user_id, social_login);
    }
    return;
  },

  async updateUser(user_id, user) {
    if (user.user_pw) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(user.user_pw, salt);
      user.user_pw = hash;
    }

    await userDAO.update(user_id, user);
    return;
  },

  async deleteUser(user_id) {
    await userDAO.destroy(user_id);
    return;
  },

  async getUser(user_id) {
    const user = await userDAO.findOne({ user_id });
    return user;
  },

  async findAccount(user_info) {
    const user = await userDAO.findOne(user_info);
    return user;
  },

  async send_message(user, temp_password) {
    let status_code = 404;
    const date = Date.now().toString();
    const uri = process.env.NCP_SENS_ID; //서비스 ID
    const secretKey = process.env.NCP_SENS_SECRET; // Secret Key
    const accessKey = process.env.NCP_SENS_ACCESS; //Access Key
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `/sms/v2/services/${uri}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    await axios
      .post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`,
        {
          type: "SMS",
          countryCode: "82",
          from: "01023085214", //발신번호(NCP 등록 번호)
          content: `${user.user_name}님의 임시 비밀번호는 ${temp_password}입니다.`, //문자내용
          messages: [{ to: `${user.user_phone}` }],
        },
        {
          headers: {
            "Content-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
          },
        }
      )
      .then((res) => (status_code = res.status))
      .catch((error) => {
        console.log("error: ", error);
        status_code = 500;
      });

    return status_code;
  },
};

module.exports = userService;
