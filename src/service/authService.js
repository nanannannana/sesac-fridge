const { userDAO } = require("../dao");
const bcrypt = require("bcryptjs");

const authService = {
  async checkUser(user_id, user_pw) {
    const user = await userDAO.findOne({ user_id });
    if (user && bcrypt.compareSync(user_pw, user.user_pw)) return true;
    return false;
  },
};

module.exports = authService;
