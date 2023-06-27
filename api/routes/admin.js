//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const workerController = require('../controllers/WorkerController')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/upload')

const router = express.Router()

router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/show-all', checkAuth.checkIfSuper, adminController.showAllAdmins)



module.exports = router;