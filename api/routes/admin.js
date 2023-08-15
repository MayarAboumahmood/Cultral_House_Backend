//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/upload')

const router = express.Router()

router.post('/signup', checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/show-all', checkAuth.checkIfSuper, adminController.showAllAdmins)

router.post('/make-reservation',  checkAuth.checkIfSuper, adminController.makeReservationByAdmin)

router.delete('/delete-reservation',  checkAuth.checkIfSuper, adminController.deleteReservationByAdmin)

router.get('/show-reservations',  checkAuth.checkIfSuper, adminController.showReservationsForAdmin)

router.get('/stats', adminController.stats)
router.post('/addWorkersToEvent', adminController.addWorkersToEvent)

router.get('/getActions', checkAuth.checkIfSuper, adminController.getActions)


module.exports = router;