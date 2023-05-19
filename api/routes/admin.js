//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()

router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/showall',checkAuth.checkIfSuper,adminController.showAllAdmins)

module.exports = router