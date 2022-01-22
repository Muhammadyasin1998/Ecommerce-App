const express = require('express');
const router = express.Router();
const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct, searchProduct } = require('../controller/product');
const { requireSignin } = require('../validator/helper')
const { upload } = require('../validator/helper')

router.post('/create-product', requireSignin, createProduct);
router.get('/get-all-product', requireSignin, getAllProduct);
router.get('/search-prodduct', requireSignin, searchProduct);
router.get('/get-single-product', requireSignin, getSingleProduct);
router.put('/update-product', requireSignin, updateProduct);
router.delete('/delete-product', requireSignin, deleteProduct);




module.exports = router;
