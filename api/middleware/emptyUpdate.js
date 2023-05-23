const checkIfEmpty = (req, res, next)=>
{
    const {first_name, last_name, phone_number, birthdate} = req.body; 
       
    const file = req.file;
    console.log(!first_name && !last_name && !phone_number && !birthdate && !file)

    if(!first_name && !last_name && !phone_number && !birthdate && !file)
    {
        return res.status(400).send({msg: "update something!!"});
        
    }
    next();

}

module.exports = checkIfEmpty;