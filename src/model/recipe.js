const recipe = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "recipe",
    {
      recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      recipe_title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      recipe_url: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      recipe_ingd: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      recipe_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipe_img: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      recipe_tag: {
        type: DataTypes.STRING(5),
      },
      recipe_pick: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      underscored: true,
      tableName: "recipe",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = recipe;
