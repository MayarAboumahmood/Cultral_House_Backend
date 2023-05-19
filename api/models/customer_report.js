
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("customer_report", {
        customer_report_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
    },
     {timestamps: true},)
}



