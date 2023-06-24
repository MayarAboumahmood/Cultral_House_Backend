
const responseMessage = require("./responseHandler");


const checkIfEmpty = (req, res, next)=>
{
    const {first_name, last_name, birthdate} = req.body; 
       
    const file = req.file;
 
   if(!first_name && !last_name && !birthdate && !file)
    {
        return res.status(400).send(responseMessage(false, "update something!!"));

        
    }

    next();

}

module.exports = checkIfEmpty;