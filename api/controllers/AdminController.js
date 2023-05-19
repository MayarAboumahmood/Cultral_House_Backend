//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models/index");
const jwt = require("jsonwebtoken");

// Assigning users to the variable User
const Admin = db.admins;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {
        const {admin_name, email, password, is_super} = req.body;
        const data = {
            admin_name,
            email,
            password: await bcrypt.hash(password, 10),
            is_super
        };
        //saving the user
        const admin = await Admin.create(data);


        if (admin) {
            let token = jwt.sign({admin: admin}, process.env.SECRET, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, {maxAge: 1 * 24 * 60 * 60, httpOnly: true});
         //   console.log("admin", JSON.stringify(admin, null, 2));
           // console.log(token);

            //send users details
            return res.status(201).json({
                admin: admin,
                token: token
            });
        } else {
            return res.status(409).json({
                msg: "admin already existing"
            });
        }
    } catch (error) {
        console.log(error);
    }
};


//login authentication

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //find a admin by their email
        const admin = await Admin.findOne({
            where: {
                email: email
            }

        });

        //if admin email is found, compare password with bcrypt
        if (admin) {
            const isSame = await bcrypt.compare(password, admin.password);

            //if password is the same
            //generate token with the admin's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({admin: admin}, process.env.SECRET, {
                    expiresIn: 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the admin
             //   console.log("admin", JSON.stringify(admin, null, 2));
               // console.log(token);
                //send admin data
                return res.status(201).json({
                    admin: admin,
                    token: token
                });
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signup,
    login,
};