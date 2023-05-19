module.exports = (sequelize, DataTypes) => {
    return sequelize.define("admin", {
        admin_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        admin_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_super: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
     {timestamps: true},)
}