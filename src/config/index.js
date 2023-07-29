const dotenv = require("dotenv");
const AppError = require("../misc/AppError");
const commonError = require("../misc/commonErrors");
const path = require("path");
const { development } = require("./config");

process.env.NODE_ENV = process.env.NODE_ENV ?? development;
console.log(`🚀애플리케이션 서버 ${process.env.NODE_ENV} 환경에서 시작🚀`);

const loadenv = dotenv.config({
  path: path.resolve(__dirname, "../../", `.env.${process.env.NODE_ENV}`),
});
if (loadenv.error) {
  throw new AppError(commonError.configError, "Couldn't find .env file", 500);
}

if (
  !process.env.MYSQL_HOST &&
  !process.env.MYSQL_DATABASE &&
  !process.env.MYSQL_USERNAME &&
  !process.env.MYSQL_PASSWORD
) {
  throw new AppError(
    commonError.configError,
    500,
    "애플리케이션을 시작하려면 MySQL(host, database, username, password) 환경변수가 필요합니다."
  );
}
const dbConfig = require("./db.config");

module.exports = {
  port: parseInt(process.env.PORT ?? "8080", 10),
  dbConfig,
};
