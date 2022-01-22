const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ''
    },

    price: {
        type: Number,
        default: 0
    },


    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    }
})




module.exports = mongoose.model('Product', productSchema);
