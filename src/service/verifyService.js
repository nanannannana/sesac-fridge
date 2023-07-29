const { userDAO } = require("../dao");

const verifyService = {
  async getUserById(user_id) {
    const user = await userDAO.findOne({ user_id });
    return user;
  },
};

module.exports = verifyService;
