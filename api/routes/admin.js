//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const workerController = require('../controllers/WorkerController')
const eventController = require('../controllers/EventController')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/upload')

const router = express.Router()

router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete-admin', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/show-all-admins', checkAuth.checkIfSuper, adminController.showAllAdmins)

router.get('/show-all-workers', checkAuth.checkIfSuper, workerController.showAllWorkers)

router.post('/create-worker', checkAuth.checkIfSuper, upload('workers').single('image'), checkAuth.checkWorker, workerController.createWorker)

router.delete('/delete-worker', checkAuth.checkIfSuper, workerController.deleteWorker)

router.post('/create-event', checkAuth.getAdminId, eventController.createEvent);

router.get('/show-all-events', eventController.showAllEvents)

router.delete('/delete-event', eventController.deleteEvent)

router.put('/update-event', eventController.updateEvent)

module.exports = router;