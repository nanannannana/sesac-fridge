const Sequelize = require("sequelize");
const { dbConfig } = require("../config");
const db = {};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Fresh = require("./fresh")(sequelize, Sequelize);
db.Frozen = require("./frozen")(sequelize, Sequelize);
db.Recipe = require("./recipe")(sequelize, Sequelize);
db.RecipeLike = require("./recipeLike")(sequelize, Sequelize);
db.Log = require("./log")(sequelize, Sequelize);
db.CookLog = require("./cookLog")(sequelize, Sequelize);
db.Oauth = require("./oauth")(sequelize, Sequelize);

db.RecipeLike.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User.hasMany(db.RecipeLike, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.RecipeLike.belongsTo(db.Recipe, {
  foreignKey: "recipe_recipe_id",
  targetKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.hasOne(db.RecipeLike, {
  foreignKey: "recipe_recipe_id",
  sourceKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Log.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User.hasMany(db.Log, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Log.belongsTo(db.Recipe, {
  foreignKey: "recipe_recipe_id",
  targetKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.hasOne(db.Log, {
  foreignKey: "recipe_recipe_id",
  sourceKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.CookLog.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User.hasMany(db.CookLog, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.CookLog.belongsTo(db.Recipe, {
  foreignKey: "recipe_recipe_id",
  targetKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.hasOne(db.CookLog, {
  foreignKey: "recipe_recipe_id",
  sourceKey: "recipe_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Fresh.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User.hasMany(db.Fresh, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Frozen.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User.hasMany(db.Frozen, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Oauth.belongsTo(db.User, {
  foreignKey: "user_user_id",
  targetKey: "user_id",
  onDelete: "cascade",
});
db.User.hasMany(db.Oauth, {
  foreignKey: "user_user_id",
  sourceKey: "user_id",
  onDelete: "cascade",
});

module.exports = db;
