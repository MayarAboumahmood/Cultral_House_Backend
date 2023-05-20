//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()

router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete-admin', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/show-all-admins',checkAuth.checkIfSuper,adminController.showAllAdmins)

router.get('/show-all-workers',checkAuth.checkIfSuper,adminController.showAllWorkers)


router.post('/create_worker',checkAuth.checkIfSuper,checkAuth.saveWorker,adminController.createWorker)

router.delete('/delete-worker', checkAuth.checkIfSuper, adminController.deleteWorker)



module.exports = router