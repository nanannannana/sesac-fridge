const recipe_like = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "recipe_like",
    {
      like_id: {
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
      tableName: "recipe_like",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = recipe_like;
