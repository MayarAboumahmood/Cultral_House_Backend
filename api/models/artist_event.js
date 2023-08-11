
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("artist_event", {
        artist_event_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        }
    },
     {timestamps: true},)
}






