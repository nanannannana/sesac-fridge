const recipe = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "recipe",
        {
            recipe_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
                primaryKey : true,
                autoIncrement : true,
            }, 
            recipe_title : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            recipe_url : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            recipe_ingd : {
                type : DataTypes.STRING(40),
                allowNull : false,
            },
            recipe_time : {
                type : DataTypes.STRING(10),
                allowNull : false,
            },
            recipe_img : {
                type : DataTypes.STRING(100),
                allowNull : false,
            },
            recipe_tag : {
                type : DataTypes.STRING(5),
            }
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            underscored: true, // 카멜표기법 -> 스네이크로
            tableName : "recipe",
            freezeTableName : true,
            timestamps : false,
            paranoid: false, // true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록
        }
    )
}

module.exports = recipe;