module.exports = (sequelize, DataTypes) => {
    return sequelize.define("event", {
        event_id: {
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
        ticket_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        available_places: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        band_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        begin_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        
        artists_cost: {
            type: DataTypes.FLOAT,
            allowNull: true
        },

    },
     {timestamps: true},)
}

