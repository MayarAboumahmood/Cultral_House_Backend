const db = require("../Models/index");
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require('./MailController');
const {unlinkSync} = require('fs');

dotenv.config();
const Customer = db.customers;
const Reservation = db.reservations;
const Event = db.events;


const signUp = async (req, res) => {

    const {first_name, last_name, email, phone_number, password, birthdate} = req.body;

    if (!req.file) {
        return res.status(400).send({msg: " img is required"})
    }
    const picture = req.file.path;

    Customer.create({
        first_name,
        last_name,
        phone_number,
        email,
        password: await bcrypt.hash(password, 10),
        birthdate,
        picture
    }).then((data) => {

        res.send({data});

    }).catch(({errors}) => {

        unlinkSync(picture);


        return res.status(400).send({msg: errors[0].message});
    });

}


const login = async (req, res) => {

    const {email, phone_number, password} = req.body;


    try {

        let customer = null;

        if (email) {
            customer = await Customer.findOne({where: {email}});

        } else {
            customer = await Customer.findOne({where: {phone_number}});

        }

        if (customer == null) {


            throw new Error("wrong credentials");

        } else {

            const check = await bcrypt.compare(password, customer.password);
            if (!check) {

                throw new Error("wrong credentials");
            } else {
                const {customer_id, first_name} = customer;


                const token = jwt.sign({customer_id, first_name}, process.env.SECRET, {expiresIn: '3d'});
                res.status(200).send({msg: "logged in", token});

            }


        }

    } catch (error) {


        return res.status(401).send({msg: error.message})
    }

}

const deleteCustomer = async (req, res) => {


    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } else {


            unlinkSync(customer.picture);

            customer.destroy();
            res.status(202).send({msg: "customer has been deleted successfully"});

        }


    } catch (error) {

        return res.status(401).send({msg: error.message});

    }


}

const update = async (req, res) => {


    const {first_name, last_name, birthdate} = req.body;
    const token = req.headers["x-access-token"];


    const file = req.file;
    let picture;
    if (file) {
        picture = file.path;
    }

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            throw new Error("customer not found");
        } else {

            if (first_name) {
                customer.first_name = first_name;
            }
            if (last_name) {
                customer.last_name = last_name;
            }

            if (birthdate) {
                customer.birthdate = birthdate;
            }
            if (picture) {
                customer.picture = picture;
            }

        }
        await customer.save();
        res.status(200).send({msg: "customer has been updated", customer});

    } catch (error) {
        return res.status(401).send({msg: error.message});

    }
}

const changeNumber = async (req, res) => {

    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }


    const {phone_number, password} = req.body;


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);
        if (customer == null) {


            throw new Error("customer not found");

        }

        if (!phone_number || !password) {
            throw new Error("please enter the new number and its old password")

        }

        const check = await bcrypt.compare(password, customer.password);
        if (!check) {

            throw new Error("wrong credentials");
        }

        const existingCustomer = await Customer.findOne({where: {phone_number}});
        if (existingCustomer && existingCustomer.customer_id !== customer.customer_id) {
            return res.status(400).json({error: 'phone number is already taken'});
        } else {
            customer.phone_number = phone_number;

            await customer.save();
            res.status(200).send({msg: "phone  number  has been updated", customer});

        }

    } catch (error) {
        return res.status(401).send({msg: error.message});

    }


}

const changeEmail = async (req, res) => {

    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }

    const {email, password} = req.body;


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);
        if (customer == null) {


            throw new Error("customer not found");

        }

        if (!email || !password) {
            throw new Error("please enter the new email and its old password")

        }

        const check = await bcrypt.compare(password, customer.password);
        if (!check) {

            throw new Error("wrong credentials");
        }

        const existingCustomer = await Customer.findOne({where: {email}});
        if (existingCustomer && existingCustomer.customer_id !== customer.customer_id) {
            return res.status(400).json({error: 'this email is already taken'});
        } else {
            customer.email = email;

            await customer.save();
            res.status(200).send({msg: "email has been updated", customer});

        }

    } catch (error) {
        return res.status(401).send({msg: error.message});

    }


}

const resetPassword = async (req, res) => {


    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }
    const {password, new_password} = req.body;


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (customer == null) {


            throw new Error("customer not found");

        }

        if (!password || !new_password) {
            throw new Error("enter the old and the new passwords");


        }

        const check = await bcrypt.compare(password, customer.password);
        if (!check) {

            throw new Error("wrong credentials");
        } else {

            customer.password = await bcrypt.hash(new_password, 10);
            customer.save();
            res.status(200).send({msg: "password has been updated", customer});


        }
    } catch (error) {
        return res.status(401).send({msg: error.message});

    }


}

const forgotPassword = async (req, res) => {

    const email = req.body.email;

    if (!email) {

        return res.status(400).send({msg: "enter your email"});

    }

    try {

        const customer = await Customer.findOne({where: {email}});

        if (customer == null) {


            throw new Error("customer not found");

        } else {

            const newPassword = Math.random().toString(36).slice(-8);

            customer.password = await bcrypt.hash(newPassword, 10);
            customer.save();


            const subject = "your new password";
            const text = `${newPassword} is your new password, change it when you login`;


            sendEmail(email, subject, text).then(
                message => {
                    res.status(200).json({msg: message});
                }
            ).catch(error => {

                return res.status(401).send({msg: error});

            });
        }

    } catch (error) {
        return res.status(401).send({msg: error.message});

    }


}


const makeReservation = async (req, res)=>
{

     const token = req.headers["x-access-token"];


    if (!token) {
        return res.status(401).send({msg: "not authorized"})
    }

    try {
        
        const event_id = req.params.event_id;

        if (!event_id) {
            throw new Error("choose the event");
        }
    

    const number_of_places = req.body.number_of_places;

    if (!number_of_places) {

        throw new Error("enter the number of the attendees");

    }

    const decode = jwt.verify(token, process.env.SECRET);


    const customer_id = decode.customer_id;
    const customer_name = decode.first_name;

    const event = await Event.findByPk(event_id);

    
    if (event == null) {

        throw new Error("event not found");

    }

    event.available_places -= number_of_places;

   const reservation = await Reservation.create({
        event_id,
        number_of_places,
        customer_id,
        customer_name

    });

    event.save();

    res.status(200).send({reservation});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

    
    
}


const setTable = async (req, res)=>
{

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({msg: "not authorized"})
    }

    try {
        
        const reservation_id = req.params.reservation_id;
        const table_number = req.body.table_number;


        if (!reservation_id) {
            throw new Error("choose the reservation");
        }

      
        const reservation = await Reservation.findByPk(reservation_id);

        if (reservation === null) {

            throw new Error("reservation not found");
    
        }


    if (!table_number) {

        throw new Error("enter the number of the table");

    }

    const decode = jwt.verify(token, process.env.SECRET);


    const customer_id = decode.customer_id;
   

   
    if(!(customer_id === reservation.customer_id))
    {
        throw new Error(" you are not allowed");

    }

    const tableIsTaken = await Reservation.findOne({where: {table_number}});


    if (!(tableIsTaken === null)) {
        throw new Error("table is taken");

    }
    reservation.table_number = table_number;

    reservation.save();

    res.status(200).send({reservation});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

    
    
}


module.exports = {signUp, login, deleteCustomer, update, changeNumber, changeEmail, resetPassword, forgotPassword, makeReservation, setTable};