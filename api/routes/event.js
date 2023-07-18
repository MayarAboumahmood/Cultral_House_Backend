const express = require('express')
const eventController = require('../controllers/EventController')
const checkAuth = require('../middleware/checkAuth')
const upload = require("../middleware/upload");

const router = express.Router()


router.post('/create', upload('events').array('images'), checkAuth.getAdminId, eventController.createEvent);

router.get('/show-all', eventController.showAllEvents)

router.delete('/delete', eventController.deleteEvent)

router.put('/update', eventController.updateEvent)

//router.get('/events/:event_id', eventController.viewEvent);

router.get('/show-upcoming-events', eventController.showUpComingEventsForCustomer)


module.exports = router;