module.exports = (sequelize, DataTypes) => {
    return sequelize.define("worker", {
            worker_id: {
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
            phone_number: {
                type: DataTypes.STRING,
                unique: true,
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
            image: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {timestamps: true},)
}


