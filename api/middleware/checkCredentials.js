const checkCredentials = (req, res, next)=>
{
    const {email, phone_number, password} = req.body;     

        if (!email && !phone_number) {
            return res.status(400).send({msg: " enter either an email or a phone number"})

        }

    if (!password) {
       return res.status(400).send({msg: " password is required"})
    }

  
    next();
}

module.exports = checkCredentials;