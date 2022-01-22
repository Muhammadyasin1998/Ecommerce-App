const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');


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
        verified: {
            type: Boolean,
            default: false,
            required: true,
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



userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
    }

    next();
})


userSchema.methods.comparepassword = async function(password) {
    const result = await bcrypt.compareSync(password, this.password);
    return result;
}

module.exports = mongoose.model('User', userSchema);