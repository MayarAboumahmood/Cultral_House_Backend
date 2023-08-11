const express = require('express')
const eventController = require('../controllers/EventController')
const checkAuth = require('../middleware/checkAuth')
const upload = require("../middleware/upload");

const router = express.Router()


router.post('/create', upload('events').array('images'), checkAuth.getAdminId, eventController.createEvent);

router.get('/show-all', eventController.showAllEvents)

router.delete('/delete', eventController.deleteEvent)

router.put('/update', eventController.updateEvent)

router.get('/show-event', eventController.showEventDetailsForCustomer);

router.get('/show-event-for-admin', eventController.showEventDetailsForAdmin);



module.exports = router;