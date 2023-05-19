module.exports = (sequelize, DataTypes) => {
    return sequelize.define("report", {
        report_id: {
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
    },
     {timestamps: true},)
}

