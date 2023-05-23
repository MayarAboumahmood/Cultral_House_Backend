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
        picture: {
            type: DataTypes.STRING,
           
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: {
                arg: true,
                msg: 'This phone number is already taken.'
            },
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please enter your phone number'
                },
                isNumeric: {
                    msg: 'phone number must be a number',
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
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            
            validate: {
                notNull: {
                  msg: 'Please enter your birth date'
                },
                isDate: {
                    arg: true,
                    msg : "please enter a valid date!"
                },
                isUnderTen(value) {
                    const currentDate = new Date();
                    const birthdate = new Date(value);
                    const age = currentDate.getFullYear() - birthdate.getFullYear();
            
                    if (age < 10) {
                      throw new Error('Grow faster!!');
                    }
                  },
              }
        },
     
    },
     {timestamps: true},)
}

