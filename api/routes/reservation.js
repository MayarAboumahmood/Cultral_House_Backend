

const express = require('express');





const router = express.Router();

const reservationController = require('../controllers/ReservationController.js');

router.post('/:event_id/make-reservation', reservationController.makeReservation);
router.post('/:reservation_id/setSection', reservationController.setSection);
router.delete('/:reservation_id/delete', reservationController.deleteReservation);
router.put('/:reservation_id/update', reservationController.updateReservation);
router.get('/', reservationController.showReservations);
router.get('/:reservation_id/view', reservationController.viewReservation);
router.get('/events', reservationController.showEvents);



module.exports = router;