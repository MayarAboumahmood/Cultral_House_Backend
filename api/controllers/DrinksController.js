const db = require("../Models/index");
const responseMessage = require("../middleware/responseHandler");
const RError = require("../middleware/error.js");
const fs = require('fs');



const Drink = db.drinks;
const ValidationError = db.ValidationError;

const addDrink = async (req, res)=>{

    //need to add worker and admin authentication (JWT) ?
    const {title, description, price,quantity, cost} = req.body;
    
    if (!req.file) {
        return res.status(400).send(responseMessage(false, " img is required" ))

        
    }
    const picture = req.file.path;
    try {

        const drink = await Drink.create({

            title,
            description,
            price,
            quantity,
            cost,
            picture
        });
        
        
        res.status(201).send(responseMessage(true, "drink has been added", drink));

    } catch (errors) {
        fs.unlinkSync(picture);

        var statusCode = errors.statusCode || 500;
        if (errors instanceof ValidationError) {

            statusCode = 400;
            
        }

        return res.status(statusCode).send(responseMessage(false, errors.message));

    }

}

const showDrinks = async (req, res)=>{


    try {

        const drinks = await Drink.findAll();
        

        res.status(200).send(responseMessage(true, "drinks have been retrieved", drinks));


    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).send(responseMessage(false, error.message));


    }

}

const viewDrink = async (req, res)=>{

    const drink_id = req.body.drink_id;
    if (!drink_id) {
        
        return res.status(400).send(responseMessage(false,"choose drink to show"));

    }


    try {

        

        const drink = await Drink.findByPk(drink_id);

        if (drink === null) {

            throw new RError(404, "drink not found");
            
        }

        res.status(200).send(responseMessage(true, "drink has been retrieved", drink));

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).send(responseMessage(false, error.message));


    }

}

const updateDrink = async (req, res)=>{

    //need to add worker and admin authentication (JWT) ? in the drinkUpload middleware 
    const {title, description, price,quantity, cost} = req.body;
    const drink_id = req.body.drink_id;


    try {

        const drink = await Drink.findByPk(drink_id);

        if (drink == null) {

            throw new RError(404, "drink not found")
            
        }

        if(title){
            drink.title = title;
        }                                                                                                                                                                       
        if(description){
            drink.description = description;
        }
        if(price){
            drink.price = price;
        }
        if(quantity){
            drink.quantity = quantity;
        } 
        if(cost){
            drink.cost = cost;
        } 
        if (req.file) {
            if (fs.existsSync(drink.picture)) {

                fs.unlinkSync(drink.picture);

            }

            drink.picture =  req.file.path;


        }
      
        
        await drink.save();

        res.status(200).send(responseMessage(true, "drink has been updated", drink));

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).send(responseMessage(false, error.message));


    }

}

module.exports = {addDrink, showDrinks, viewDrink, updateDrink};

