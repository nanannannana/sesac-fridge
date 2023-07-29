const user = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        primaryKey: true,
      },
      user_pw: {
        type: DataTypes.STRING(100),
      },
      user_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      user_phone: {
        type: DataTypes.INTEGER,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      underscored: true,
      tableName: "user",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = user;
