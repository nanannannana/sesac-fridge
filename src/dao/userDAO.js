const { User, Oauth } = require("../model");

const userDAO = {
  async findOne(where) {
    const user = await User.findOne({ raw: true, where });
    return user;
  },

  async create(user) {
    await User.create(user);
    return;
  },

  async update(user_id, user) {
    await User.update(user, { where: { user_id } });
    return;
  },

  async destroy(user_id) {
    await User.destroy({ where: { user_id } });
    return;
  },
};

module.exports = userDAO;
