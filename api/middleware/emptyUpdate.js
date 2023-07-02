
const responseMessage = require("./responseHandler");


const checkIfEmpty = (req, res, next)=>
{
    const {first_name, last_name} = req.body; 
       
 
   if(!first_name && !last_name)
    {
        return res.status(400).send(responseMessage(false, "update something!!"));

        
    }

    next();

}

module.exports = checkIfEmpty;