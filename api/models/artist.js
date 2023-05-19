
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("artist", {
        artist_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        artist_name: {
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


