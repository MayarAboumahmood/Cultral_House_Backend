const express = require('express');
const checkIfEmpty = require('../middleware/emptyUpdate')
const checkCredentials = require('../middleware/checkCredentials')




const router = express.Router();

const customerController = require('../controllers/CustomerController');


router.post('/signup', checkCredentials,customerController.signUp);
router.post('/login',checkCredentials,customerController.login);
router.delete('/delete',customerController.deleteCustomer);
router.put('/update', checkIfEmpty, customerController.update);
router.put('/change-number', customerController.changeNumber);
router.put('/change-email', customerController.changeEmail);
router.put('/reset-password', customerController.resetPassword);
router.post('/forgot-password', customerController.forgotPassword);





module.exports = router;