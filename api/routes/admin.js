//importing modules
const express = require('express')
const adminController = require('../controllers/AdminController')
const checkAuth = require('../middleware/checkAuth')
const upload = require('../middleware/fileSaver')

const router = express.Router()

router.post('/signup', checkAuth.checkIfSuper, checkAuth.saveAdmin, adminController.createAdmin)

router.post('/login', adminController.login)

router.delete('/delete-admin', checkAuth.checkIfSuper, adminController.deleteAdmin)

router.get('/show-all-admins', checkAuth.checkIfSuper, adminController.showAllAdmins)

router.get('/show-all-workers', checkAuth.checkIfSuper, adminController.showAllWorkers)

router.post('/create-worker', checkAuth.checkIfSuper, upload.workerPhotoUploader.single('image'), checkAuth.checkWorker, adminController.createWorker)

router.delete('/delete-worker', checkAuth.checkIfSuper, adminController.deleteWorker)

router.post('/create-event', checkAuth.getAdminId, adminController.createEvent);

router.get('/show-all-events', adminController.showAllEvents)

router.delete('/delete-event', adminController.deleteEvent)

module.exports = router