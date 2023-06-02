const checkIfEmpty = (req, res, next)=>
{
    const {first_name, last_name, birthdate} = req.body; 
       
    const file = req.file;
    const token = req.headers["x-access-token"];

    if(!token)
    {
       return res.status(401).send({msg:"not authorized"})
 
    }
 

    if(!first_name && !last_name && !birthdate && !file)
    {
        return res.status(400).send({msg: "update something!!"});
        
    }

    next();

}

module.exports = checkIfEmpty;