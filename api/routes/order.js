const express = require('express');




const router = express.Router();

const orderController = require('../controllers/OrderController.js');



router.post('/make-order', orderController.makeOrder);
router.get('/:order_id/show-order', orderController.showOrderDetails);
router.put('/:order_id/update-order', orderController.updateOrder);
router.delete('/:order_id/delete-order', orderController.deleteOrder);
router.get('/show-orders', orderController.showOrders);
router.get('/browseBills', orderController.browseBills);
router.get('/show-all-orders', orderController.showAllOrders);




module.exports = router;