const mongoose = require('mongoose');



const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
        },
        email: {
            type: String,
            trim: true,
            require: true,
        }
        , password: {
            type: String,
            require: true,
        },
        phone: {
            type: String,

        },
        created: {
            type: Date,
            default: Date.now,
        },
        updated: Date,

    }

);



userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', userSchema);