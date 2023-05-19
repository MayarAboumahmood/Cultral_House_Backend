//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const {createAdmin, login, deleteAdmin} = adminController
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, createAdmin)

//login route
router.post('/login', login)

router.delete('/delete', checkAuth.checkIfSuper, deleteAdmin)


module.exports = router