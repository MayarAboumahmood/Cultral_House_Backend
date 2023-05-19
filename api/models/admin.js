module.exports = (sequelize, DataTypes) => {
    return sequelize.define("admin", {
        admin_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            require: true

        },
        admin_name: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true

        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false,
            require: true

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true

        },
        is_super: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            require: true,
            defaultValue: false

        }
    },
     {timestamps: true},)
}