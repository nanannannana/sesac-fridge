const { sequelize } = require("../model");

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("### Sequelize가 MySQL에 정상적으로 연결되었습니다.");
  } catch (error) {
    console.error(`### Sequelize가 MySQL과의 연결을 실패하였습니다.: ${error}`);
  }
}

async function disconnectDB() {
  try {
    await sequelize.close();
    console.log("### Sequelize가 MySQL과의 연결을 정상적으로 끊었습니다.");
  } catch (error) {
    console.error(`### Sequelize가 MySQL과의 연결을 실패하였습니다.: ${error}`);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
