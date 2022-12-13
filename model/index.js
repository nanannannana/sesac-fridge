const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

// db connection
const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)

db.sequelize = sequelize; 
de.Sequelize = Sequelize;

// 유저 테이블
db.user = require("./user")(sequelize, Sequelize);

// 냉장고 테이블 

// 레시피 테이블

// 각각 다른 테이블 생성 
