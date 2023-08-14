module.exports = (sequelize, DataTypes) => {
    return sequelize.define("reservation", {
        reservation_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        attendance: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:false
        },
        number_of_places: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attendance_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        section_number: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
     
    },
     {timestamps: true},)
}





