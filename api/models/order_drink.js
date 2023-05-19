module.exports = (sequelize, DataTypes) => {
    return sequelize.define("order_drink", {
        order_drink_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
     {timestamps: true},)
}










