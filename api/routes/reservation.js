

const express = require('express');





const router = express.Router();

const reservationController = require('../controllers/ReservationController.js');

router.post('/make-reservation', reservationController.makeReservation);
router.post('/setSection', reservationController.setSection);
router.delete('/delete', reservationController.deleteReservation);
router.put('/update', reservationController.updateReservation);
router.get('/', reservationController.showReservations);
router.get('/view', reservationController.viewReservation);
router.get('/events', reservationController.showEvents);



module.exports = router;