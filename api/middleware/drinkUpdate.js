const checkIfEmpty = (req, res, next)=>
{
    const {title, description, price,quantity, cost} = req.body;
    const drink_id = req.params.drink_id;       
  
    if(!drink_id || !Number(drink_id))
    {
        return res.status(400).send({msg: "choose drink"});

    }

    if(!title && !description && !price && !quantity && !cost)
    {
        return res.status(400).send({msg: "update something!!"});
        
    }

    next();

}

module.exports = checkIfEmpty;