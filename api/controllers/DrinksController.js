const db = require("../Models/index");
const dotenv = require('dotenv');


dotenv.config();

const Drink = db.drinks;

const addDrink = async (req, res)=>{

    //need to add worker and admin authentication (JWT) ?
    const {title, description, price,quantity, cost} = req.body;
    
    if (!req.file) {
        return res.status(400).send({msg: " img is required"})
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
        
        
        res.status(200).send({drink});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

}

const showDrinks = async (req, res)=>{


    try {

        const drinks = await Drink.findAll();
        

        res.status(200).send({drinks});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

}

const viewDrink = async (req, res)=>{

    const drink_id = req.params.drink_id;
    try {

        const drink = await Drink.findByPk(drink_id);

        if (drink === null) {

            throw new Error("drink not found");
            
        }

        res.status(200).send({drink});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

}

const updateDrink = async (req, res)=>{

    //need to add worker and admin authentication (JWT) ? in the drinkUpload middleware 
    const {title, description, price,quantity, cost} = req.body;
    const drink_id = req.params.drink_id;


    try {

        const drink = await Drink.findByPk(drink_id);

        if (drink == null) {

            throw new Error("drink not found")
            
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
            drink.picture = req.file.path;

        }
      
        
        await drink.save();

        res.status(200).send({drink});

    } catch (error) {
        res.status(401).send({msg: error.message});

    }

}

module.exports = {addDrink, showDrinks, viewDrink, updateDrink};

