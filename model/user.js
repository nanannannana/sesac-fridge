const user = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "user",
        {
            user_id : {
                type : DataTypes.STRING(40),
                allowNull : false,
                primaryKey : true
            }, 
            user_pw : {
                type : DataTypes.STRING(20),
                allowNull : false
            },
            user_name : {
                type : DataTypes.STRING(20),
                allowNull : false
            },
            user_phone : {
                type : DataTypes.INTEGER,
                allowNull : false
            }
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            underscored: true, // 카멜표기법-> 스네이크로
            tableName : "user",
            freezeTableName : true,
            timestamps : false,
            paranoid: false, // true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록
        }
    )
}

module.exports = user;