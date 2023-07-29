const oauth = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "oauth",
    {
      user_user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        primaryKey: true,
      },
      social_login: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING(100),
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      underscored: true,
      tableName: "oauth",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = oauth;
