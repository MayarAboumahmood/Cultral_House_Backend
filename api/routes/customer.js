const express = require('express');
const upload = require('../middleware/upload')
const checkIfEmpty = require('../middleware/emptyUpdate')



const router = express.Router();

const customerController = require('../controllers/CustomerController');


router.post('/signup', upload.single('picture'),customerController.signUp);
router.post('/login',customerController.login);
// router.delete('/:customer_id/delete',customerController.deleteCustomer);
router.delete('/delete',customerController.deleteCustomer);
router.put('/update', upload.single('picture'), checkIfEmpty, customerController.update);






module.exports = router;