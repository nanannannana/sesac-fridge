const { Oauth } = require("../model");

const oauthDAO = {
  async create(user_user_id, social_login) {
    await Oauth.create({ user_user_id, social_login });
    return;
  },
};

module.exports = oauthDAO;
