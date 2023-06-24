const responseMessage = require("./responseHandler");


const checkCredentials = (req, res, next)=>
{
    const {email, phone_number, password} = req.body;     

        if (!email && !phone_number) {
            return res.status(400).send(responseMessage(false," enter either an email or a phone number"));

        }

    if (!password) {
       return res.status(400).send(responseMessage(false, " password is required")
       )

    }


    next();
}

module.exports = checkCredentials;