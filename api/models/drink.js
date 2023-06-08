module.exports = (sequelize, DataTypes) => {
    return sequelize.define("drink", {
        drink_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
           
        },
    },
     {timestamps: true},)
}




