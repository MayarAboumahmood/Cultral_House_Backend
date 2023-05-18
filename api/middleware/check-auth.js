//importing modules
const express = require("express");
const db = require("../Models");
const jwt = require('jsonwebtoken')
const env = require('dotenv');
//Assigning db.admins to Admin variable
const Admin = db.admins;

//Function to check if adminName or email already exist in the database
//this is to avoid having two admins with the same adminName and email
const saveAdmin = async (req, res, next) => {
    //search the database to see if admin exist
    try {
        const admin_name = await Admin.findOne({
            where: {
                admin_name: req.body.admin_name,
            },
        });
        //if adminName exist in the database respond with a status of 409
        if (admin_name) {
            return res.json(409).send("adminName already taken");
        }

        //checking if email already exist
        const emailCheck = await Admin.findOne({
            where: {
                email: req.body.email,
            },
        });

        //if email exist in the database respond with a status of 409
        if (emailCheck) {
            return res.json(409).send("Authentication failed");
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

const checkIfSuper = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        res.status(403).json({
            msg: "No token provided!"
        })
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    msg: "Unauthorized!"
                })
            } else {
                if(decoded.admin.is_super===0){
                    res.status(401).json({
                        msg:'you are not the super admin'
                    })
                }else{
                    next()
                }
            }
        })

    }

}

//exporting module
module.exports = {
    saveAdmin,
    checkIfSuper
};