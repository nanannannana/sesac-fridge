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
db.Sequelize = Sequelize;

// 냉장고 테이블 
db.fresh = require("./fresh")(sequelize, Sequelize);
db.frozen = require("./frozen")(sequelize, Sequelize);

// 좋아요 테이블
db.recipe_like = require("./recipe_like")(sequelize, Sequelize);

// 레시피 테이블
db.recipe = require("./recipe")(sequelize, Sequelize);

// 유저 테이블
db.user = require("./user")(sequelize, Sequelize);

// 로그 테이블
db.log = require("./log")(sequelize, Sequelize);


//forien key 설정
// 1. like 테이블과 user 테이블
// 1-1. like 테이블의 user_id는 user 테이블의 user_id를 참조하고 있다.
// db.like의 user_id는 db.user의 user_id에 속한다.
db.recipe_like.belongsTo(db.user, {
    forienKey : "user_user_id", // like테이블의 forienkey할 컬럼 이름
    targetKey : "user_id", // user테이블의 user_id컬럼 이름
    onDelete : "cascade",
    onUpdate : "cascade",
})
// 1-2. user 테이블의 user_id는 like 테이블의 user_id에 참조된다.
// db.User는 가지고있다. 많이. db.like를
db.user.hasMany(db.recipe_like, {
    forienKey : "user_user_id", // like테이블의 forienkey할 컬럼 이름
    sourceKey : "user_id", // user테이블의 user_id컬럼 이름
    onDelete : "cascade",
    onUpdate : "cascade",
})

// 2. like 테이블과 recipe 테이블
// 2-1. like 테이블의 recipe_id는 recipe 테이블의 recipe_id를 참조하고 있다.
// db.like의 recipe_id는 db.recipe의 recipe_id에 속한다.
db.recipe_like.belongsTo(db.recipe, {
    forienKey : "recipe_recipe_id", // like테이블의 forienkey할 컬럼 이름
    targetKey : "recipe_id", // recipe테이블의 recipe_id 컬럼
    onDelete : "cascade",
    onUpdate : "cascade",
})
// 2-2. recipe 테이블의 recipe_id는 like 테이블의 recipe_id에 참조된다.
// db.recipe는 가지고있다. db.like를
db.recipe.hasOne(db.recipe_like, {
    forienKey : "recipe_recipe_id", // like테이블의 forienkey할 컬럼 이름
    sourceKey : "recipe_id", // recipe테이블의 recipe_id 컬럼
    onDelete : "cascade",
    onUpdate : "cascade",
})

// 3. log 테이블과 user 테이블
// 1-1. log 테이블의 user_id는 user 테이블의 user_id를 참조하고 있다.
// db.log의 user_id는 db.user의 user_id에 속한다.
db.recipe_like.belongsTo(db.user, {
    forienKey : "user_user_id", // like테이블의 forienkey할 컬럼 이름
    targetKey : "user_id", // user테이블의 user_id컬럼 이름
    onDelete : "cascade",
    onUpdate : "cascade",
})
// 1-2. user 테이블의 user_id는 log 테이블의 user_id에 참조된다.
// db.User는 가지고있다. 많이. db.log를
db.user.hasMany(db.recipe_like, {
    forienKey : "user_user_id", // like테이블의 forienkey할 컬럼 이름
    sourceKey : "user_id", // user테이블의 user_id컬럼 이름
    onDelete : "cascade",
    onUpdate : "cascade",
})

// 4. log 테이블과 recipe 테이블
// 2-1. log 테이블의 recipe_id는 recipe 테이블의 recipe_id를 참조하고 있다.
// db.log의 recipe_id는 db.recipe의 recipe_id에 속한다.
db.recipe_like.belongsTo(db.recipe, {
    forienKey : "recipe_recipe_id", // like테이블의 forienkey할 컬럼 이름
    targetKey : "recipe_id", // recipe테이블의 recipe_id 컬럼
    onDelete : "cascade",
    onUpdate : "cascade",
})
// 2-2. recipe 테이블의 recipe_id는 log 테이블의 recipe_id에 참조된다.
// db.recipe는 가지고있다 db.log를
db.recipe.hasOne(db.recipe_like, {
    forienKey : "recipe_recipe_id", // like테이블의 forienkey할 컬럼 이름
    sourceKey : "recipe_id", // recipe테이블의 recipe_id 컬럼
    onDelete : "cascade",
    onUpdate : "cascade",
})



module.exports = db;