module.exports = (sequelize, DataTypes) => {
    return sequelize.define("customer", {
        customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
     
    },
     {timestamps: true},)
}

