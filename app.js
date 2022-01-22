const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
}).then(() => console.log('database connection established'));
mongoose.connection.on('error', err => console.log('connection error' + err.message));


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//get Routes
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

app.use('/users', userRoute);

app.use('/product', productRoute);
app.use('/order', orderRoute);





const port = process.env.PORT
app.listen(port, (req, res) => console.log(`listen on ${port}`))






