const express = require("express");
const router = express.Router();
const {createAdmin} = require("../controllers/AdminController.js");


router.route('/create').post(createAdmin);



module.exports = router;