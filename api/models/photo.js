module.exports = (sequelize, DataTypes) => {
    return sequelize.define("photo", {
        photo_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
     {timestamps: true},)
}
