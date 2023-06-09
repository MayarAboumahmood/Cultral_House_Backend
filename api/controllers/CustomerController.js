const db = require("../Models/index");
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require('./MailController');
const {unlinkSync} = require('fs');
const { consumers } = require("stream");
const { resolve } = require("path/win32");


dotenv.config();
const Customer = db.customers;
const Reservation = db.reservations;
const Event = db.events;
const Order = db.orders;
const Orders_drinks = db.orders_drinks;
const Op = db.Op;
const sequelize = db.sequelize;
const Drink = db.drinks;





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

             await customer.destroy();
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
            await customer.save();
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

    if (number_of_places < 1) {
        throw new Error("enter a valid number");

    }

    if (number_of_places > event.available_places) {
        throw new Error("no enough spots in the events");

    }

    event.available_places -= number_of_places;

   const reservation = await Reservation.create({
        event_id,
        number_of_places,
        customer_id,
        customer_name

    });

    await event.save();

    res.status(200).send({reservation});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

    
    
}


const setSection = async (req, res)=>
{

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({msg: "not authorized"})
    }

    try {
        
        const reservation_id = req.params.reservation_id;
        const section_number = req.body.section_number;


        if (!reservation_id) {
            throw new Error("choose the reservation");
        }

      
        const reservation = await Reservation.findByPk(reservation_id);

        if (reservation === null) {

            throw new Error("reservation not found");
    
        }


    if (!section_number) {

        throw new Error("enter the number of the section");

    }
    if (section_number < 1) {
        throw new Error("enter a valid number");

    }

    const decode = jwt.verify(token, process.env.SECRET);


    const customer_id = decode.customer_id;
   

   
    if(!(customer_id === reservation.customer_id))
    {
        throw new Error(" you are not allowed");

    }

  
    const reservations = await Reservation.count({
        where: { section_number },
      });

    if (reservations === 10) {
        throw new Error(" there is no space in this section");

        
    }


  
    reservation.section_number = section_number;

    await reservation.save();

    res.status(200).send({reservation});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

    
    
}


const deleteReservation = async (req, res)=>{

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({msg: "not authorized"})
    }

    try {
        
        const reservation_id = req.params.reservation_id;


        if (!reservation_id) {
            throw new Error("choose the reservation");
        }

      
        const reservation = await Reservation.findByPk(reservation_id);

        if (reservation === null) {

            throw new Error("reservation not found");
    
        }
        const decode = jwt.verify(token, process.env.SECRET);


        const customer_id = decode.customer_id;
       
    
       
        if(!(customer_id === reservation.customer_id))
        {
            throw new Error(" you are not allowed");
    
        }
        else{


            const event_id = reservation.event_id;

            const number_of_places = reservation.number_of_places;
            const event = await Event.findByPk(event_id);

            event.available_places += number_of_places;

            await reservation.destroy();
            await event.save();
            res.status(202).send({msg: "reservation has been deleted successfully"});

        }


    } catch (error) {
        res.status(401).send({msg: error.message});

    }



}


const updateReservation = async (req, res)=>{
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({msg: "not authorized"})
    }

    try {
        
        const reservation_id = req.params.reservation_id;
        const number_of_places = req.body.number_of_places;


        if (!reservation_id) {
            throw new Error("choose the reservation");
        }

      
        const reservation = await Reservation.findByPk(reservation_id);

        if (reservation === null) {

            throw new Error("reservation not found");
    
        }


    if (!number_of_places) {

        throw new Error("enter the number of the places");

    }

    const decode = jwt.verify(token, process.env.SECRET);


    const customer_id = decode.customer_id;
   

   
    if(!(customer_id === reservation.customer_id))
    {
        throw new Error(" you are not allowed");

    }

  
    const old = reservation.number_of_places;

    const newNum = old - number_of_places;



    const event_id = reservation.event_id;

    const event = await Event.findByPk(event_id);

    if (number_of_places < 1) {
        throw new Error("enter a valid number");

    }


    event.available_places += newNum;

    if (event.available_places < 0) {
        throw new Error("no enough spots in the events");

    }

    reservation.number_of_places = number_of_places;
  

    await reservation.save();

    await event.save();

    res.status(200).send({reservation});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

    
    
}



const showReservations = async (req, res)=>{


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


            const reservations = await Reservation.findAll({where:{customer_id}});

            if (reservations.length === 0) {
                throw new Error("no reservations found");


            }

            res.status(202).send({msg: reservations});

        }


    } catch (error) {

        return res.status(401).send({msg: error.message});

    }

}


const viewReservation = async (req, res)=>{


    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }


    const reservation_id = req.params.reservation_id;

    if (!reservation_id) {
        
        return res.status(400).send({msg: "choose reservation to show"})

    }

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } else {


            const reservation = await Reservation.findOne({where:{reservation_id}});

            if (reservation == null) {
                
                throw new Error("reservation not found");


            }

            if (reservation.customer_id !== customer_id) {

                throw new Error("Not allowed");
                
            }

            res.status(202).send({msg: reservation});

        }


    } catch (error) {

        return res.status(401).send({msg: error.message});

    }

}



const showEvents = async (req, res)=>{



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


            const reservations = await Reservation.findAll({where:{customer_id}});

            if (reservations.length == 0) {
                
                throw new Error("no events found");


            }

            const event_id = reservations.map(v => v.event_id);
          
           const events = await Event.findAll({
                where: {
                    [Op.or]: {event_id},
                },
              })
            

            res.status(202).send({msg: events});

        }


    } catch (error) {

        return res.status(401).send({msg: error.message});

    }




}

const viewEvent = async (req, res)=>{


    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }


    const event_id = req.params.event_id;

    if (!event_id) {
        
        return res.status(400).send({msg: "choose event to show"})

    }

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } else {


            const event = await Event.findOne({where:{event_id}});

            if (event == null) {
                
                throw new Error("event not found");


            }

            res.status(202).send({msg: event});

        }


    } catch (error) {

        return res.status(401).send({msg: error.message});

    }




}

const makeOrder = async (req, res)=>{

    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }

    const reservation_id = req.body.reservation_id;
    const drinks = req.body.drinks;

    if(!reservation_id){
        return res.status(400).send({msg: "insert reservaation_id"})

    }
    if(!drinks){
        return res.status(400).send({msg: "insert drinks"})

    }

     let transaction;

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;
        
        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        }



         transaction = await sequelize.transaction();

        const order = await Order.create({

            order_date: Date(),
            reservation_id,

        },{transaction});



        const ODS = [];

        for(const drink of drinks)
        {
            const { drink_id, quantity } = drink;


            const od = await Orders_drinks.create({
                order_id : order.order_id,

                drink_id,
    
                quantity

            }, {transaction});

            ODS.push(od);

        }
        
       await transaction.commit();

        res.status(202).send({order, ODS});

    } catch (error) {

        await transaction.rollback();

        return res.status(401).send({msg: error.message});

    }
}

const showOrderDetails = async (req, res)=>{


    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }

    const order_id = req.body.order_id;


    if (!order_id) {
        
        return res.status(400).send({msg: "choose order to show"})

    }


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } 


        const order = await Order.findByPk(order_id);

        if (order === null) {
            throw new Error("no order found");

        }

        const reservation = await Reservation.findByPk(order.reservation_id);


        const check = reservation.customer_id === customer_id;

        if (!check) {
            throw new Error("not allowed");

        }

        const ODS = await Orders_drinks.findAll({where: {order_id}});


        res.status(202).send({order, ODS});
        
    } catch (error) {

        return res.status(401).send({msg: error.message});

        
    }

   
}


const updateOrder = async (req, res)=>{

    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }

    const drinks  = req.body.drinks;
    const order_id = req.body.order_id;


    if(!order_id){


        return res.status(400).send({msg: "choose order"});

    }

    if (!drinks) {
        
        return res.status(400).send({msg: "update something"})

    }

    let transaction;

    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } 



        const oldODS = await Orders_drinks.findAll({where: {order_id}});

        transaction = await sequelize.transaction();


        for(od of oldODS){

            await od.destroy({transaction});
        }



        const ODS = [];

        for(const drink of drinks)
        {
            const { drink_id, quantity } = drink;


            const od = await Orders_drinks.create({
                order_id : order_id,

                drink_id,
    
                quantity

            }, {transaction});


            ODS.push(od);

        }
        
        await transaction.commit();
        res.status(202).send({ODS});
        
    } catch (error) {

        await transaction.rollback();
        return res.status(401).send({msg: error.message});

        
    }


}


const deleteOrder = async (req, res)=>{



    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({msg: "not authorized"})

    }

    const order_id = req.body.order_id;


    if (!order_id) {
        
        return res.status(400).send({msg: "choose order to show"})

    }


    try {

        const decodedToken = jwt.verify(token, process.env.SECRET);

        const customer_id = decodedToken.customer_id;

        const customer = await Customer.findByPk(customer_id);

        if (!customer) {
            throw new Error("customer not found");
        } 


        const order = await Order.findByPk(order_id);

        if (order === null) {
            throw new Error("no order found");

        }

        const reservation = await Reservation.findByPk(order.reservation_id);


        const check = reservation.customer_id === customer_id;

        if (!check) {
            throw new Error("not allowed");

        }

        await order.destroy();


        res.status(202).send({order});
        
    } catch (error) {

        return res.status(401).send({msg: error.message});

        
    }



}


const showOrders = async (req, res)=>{

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
        } 


        const reservations = await Reservation.findAll({where:{customer_id}});
       const reservation_id = reservations.map(v=> v.reservation_id);

        const orders = await Order.findAll({
            where :{
                [Op.or]: {reservation_id}
            }
        });


        if (orders.length == 0) {
                
            throw new Error("no orders found");


        }

                res.status(202).send({orders});
        
    } catch (error) {

        return res.status(401).send({msg: error.message});

        
    }

}

// show my bills

const browseBills = async (req, res)=>{

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
        } 


        const reservations = await Reservation.findAll({where:{customer_id}});

       let result = [];
       let temp;

       for(const resrvation of reservations){
        temp = [];
        const {reservation_id} = resrvation;
        const orders = await Order.findAll({
            where :{
            reservation_id
            }
        });

        if (orders.length == 0) {
                
            throw new Error("no orders found");


        }

        const order_id = orders.map(v=> v.order_id);
        const ODS = await Orders_drinks.findAll({
            where :{
                [Op.or]: {order_id}
            }
        });

        const drink_id = ODS.map(v=> v.drink_id);

        const drinks = await Drink.findAll({
            where :{
                [Op.or]: {drink_id}
            }
        });

           
        let t = 0;

       for(const drink of drinks){
        const {title, price, drink_id} = drink;

        for (let index = 0; index < ODS.length; index++) {

            if (ODS[index].drink_id === drink_id) {

                const {quantity} = ODS[index];

                const v = price * quantity;
                const obj = {
                    drink: title,
                    price: price,
                    quantity: quantity,
                    total: v
                }

                t+=v;
                temp.push(obj);

            }
            
        }



       }
       temp.push({totalAmount: t})
       result.push(temp);


       }





     res.status(202).send({result});
        
    } catch (error) {

        return res.status(401).send({msg: error.message});

        
    }


}

module.exports = {signUp, login, deleteCustomer, update, changeNumber, changeEmail, resetPassword, forgotPassword,
     makeReservation, setSection, deleteReservation, updateReservation,showEvents, viewReservation, 
     showReservations, viewEvent, makeOrder, showOrderDetails, updateOrder, deleteOrder, showOrders, browseBills};