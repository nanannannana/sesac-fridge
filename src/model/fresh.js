const fresh = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "fresh",
    {
      fresh_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fresh_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      fresh_expire: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fresh_range: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      user_user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      fresh_category: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      underscored: true,
      tableName: "fresh",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = fresh;
