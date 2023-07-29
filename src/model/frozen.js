const frozen = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "frozen",
    {
      frozen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      frozen_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      frozen_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      frozen_range: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
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
      tableName: "frozen",
      freezeTableName: true,
      timestamps: false,
      paranoid: false,
    }
  );
};

module.exports = frozen;
