module.exports = (sequelize, DataTypes) => {
    return sequelize.define("customer", {
        customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please enter your first name'
                }
              }

        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please enter your last name'
                }
              }
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: {
                arg: true,
                msg: 'This phone number is already taken.'
            },
            allowNull: true,
            validate: {
              len: [10,15], 
                isNumeric: {
                    msg: 'phone number must be a number',
                  }
              },
              
        },
        email: {
          type: DataTypes.STRING,
          unique: {
              arg: true,
              msg: 'This email is already taken.'
          },
          allowNull: true,
          validate: {
              isEmail: {
                  msg: 'Enter a vaild email',
                }
            },
            
      },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please enter your password'
                }
              }
        },
    },
     {timestamps: true},)
}

