const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus, 
  updateOrderPayment 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, admin, updateOrderStatus);

router.route('/:id/pay').put(protect, admin, updateOrderPayment);

module.exports = router;