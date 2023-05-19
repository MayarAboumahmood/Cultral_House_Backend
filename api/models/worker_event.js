module.exports = (sequelize, DataTypes) => {
    return sequelize.define("worker_event", {
        worker_event_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    },
     {timestamps: true},)
}






