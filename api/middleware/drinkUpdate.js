const responseMessage = require("./responseHandler");


const checkIfEmpty = (req, res, next)=>
{
    const {title, description, price,quantity, cost} = req.body;
    const drink_id = req.body.drink_id;       
  
    if(!drink_id)
    {
        return res.status(400).send(responseMessage(false, "choose drink"));


    }

    if(!title && !description && !price && !quantity && !cost)
    {
        return res.status(400).send(responseMessage(false, "update something!!"));
    }

    next();

}

module.exports = checkIfEmpty;