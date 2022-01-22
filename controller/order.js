const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();



///
///=================Get All Order ==================================
///
exports.getAllOrder = async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').populate('orderItems').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
}



///
///=================Get Spacific order ==================================
///
exports.getProductById = async (req, res) => {
    const { orderId } = req.query
    const order = await Order.findById(orderId)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product'
            }
        });

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
}




///
///=================Add Item to Cart==================================
///
exports.createOrder = async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved)

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemIds => {
        console.log(`order item ${orderItemIds}`)
        const orderItem = await OrderItem.findById(orderItemIds).populate('product', 'price');
        if (!orderItem) return res.send('order item not found');
        const totalPrice = orderItem.product.price * orderItem.quantity

        return totalPrice;
    }))
    console.log(`total prices ${totalPrices}`);
    const totalPrice = totalPrices.reduce((initial, sum) => initial + sum, 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
}




///
///============update order status==================
///
exports.updateOrder = async (req, res) => {
    const { orderId } = req.query;


    Order.findByIdAndUpdate(orderId, {
        status: req.body.status,

    },
        { new: true }
    ).then(order => {
        if (!order) return res.send('order not found');
        res.send(order);
    }).catch(err => res.send(err.message));



}


///
///============remove order from cart==================
///
exports.removeOrder = async (req, res) => {
    const { orderId } = req.query
    Order.findByIdAndRemove(orderId).then(async order => {
        if (order) {
            console.log(`order items ${order.orderItems}`);
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}



///
///=================update order ==================================
///