const cooklog = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "cooklog",
        {
            cooklog_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
                primaryKey : true,
                autoIncrement : true,
            }, 
            recipe_recipe_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            user_user_id : {
                type : DataTypes.STRING(40),
                allowNull : false,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            underscored: true, // 카멜표기법 -> 스네이크로
            tableName : "cooklog",
            freezeTableName : true,
            timestamps : false,
            paranoid: false, // true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록
        }
    )
}

module.exports = cooklog;