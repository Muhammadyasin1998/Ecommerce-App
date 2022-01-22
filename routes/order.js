const express = require('express');
const router = express.Router();
const { createOrder, getProductById, getAllOrder, removeOrder, updateOrder } = require('../controller/order');

const { requireSignin } = require('../validator/helper')


router.post('/create-order', requireSignin, createOrder);
router.get('/get-all-order', requireSignin, getAllOrder);
router.get('/get-single-order', requireSignin, getProductById);
router.delete('/delete-order', requireSignin, removeOrder);
router.put('/update-order', requireSignin, updateOrder);


module.exports = router;
