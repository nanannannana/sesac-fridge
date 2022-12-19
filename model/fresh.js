const fresh = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "fresh",
        {
            fresh_name : {
                type : DataTypes.STRING(20),
                allowNull : false,
                primaryKey : true,
            }, 
            fresh_expire : {
                type : DataTypes.DATEONLY,
                allowNull : false,
                defaultValue : DataTypes.NOW,
            },
            fresh_range : {
                type : DataTypes.INTEGER,
                allowNull : false,
                defaultValue : 100,
            },
            user_user_id : {
                type : DataTypes.STRING(40),
                allowNull : false,
            }
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            underscored: true, // 카멜표기법 -> 스네이크로
            tableName : "fresh",
            freezeTableName : true,
            timestamps : false,
            paranoid: false, // true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록
        }
    )
}

module.exports = fresh;