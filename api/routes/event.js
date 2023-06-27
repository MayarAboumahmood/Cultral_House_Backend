
const express = require('express')
const eventController = require('../controllers/EventController')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()


router.post('/create', checkAuth.getAdminId, eventController.createEvent);

router.get('/show-all', eventController.showAllEvents)

router.delete('/delete', eventController.deleteEvent)

router.put('/update', eventController.updateEvent)

//router.get('/events/:event_id', eventController.viewEvent);



module.exports = router;