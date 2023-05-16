const Admin = require('../models/admin');

async function createAdmin(req, res)
{

    const admin_name = req.body.admin_name;
    const password = req.body.password;
    const is_super = req.body.is_super;


    const admin =  new Admin(admin_name, password, is_super);

    const resoult = await Admin.create(admin);

    res.status(200).json(resoult);

}

module.exports = {createAdmin};