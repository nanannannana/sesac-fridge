const log = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "log",
    {
      log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      recipe_recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      underscored: true,
      tableName: "log",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = log;
