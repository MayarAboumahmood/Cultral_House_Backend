const express = require('express');
const upload = require('../middleware/upload')
const checkIfEmpty = require('../middleware/emptyUpdate')
const checkCredentials = require('../middleware/checkCredentials')




const router = express.Router();

const customerController = require('../controllers/CustomerController');


router.post('/signup', upload('customers').single('picture'), checkCredentials,customerController.signUp);
router.post('/login',checkCredentials,customerController.login);
router.delete('/delete',customerController.deleteCustomer);
router.put('/update', upload('customers').single('picture'), checkIfEmpty, customerController.update);
router.put('/change-number', customerController.changeNumber);
router.put('/change-email', customerController.changeEmail);
router.put('/reset-password', customerController.resetPassword);
router.post('/forgot-password', customerController.forgotPassword);
router.post('/events/:event_id/make-reservation', customerController.makeReservation);
router.post('/events/reservations/:reservation_id', customerController.setTable);





module.exports = router;