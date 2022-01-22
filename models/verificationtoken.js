const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');


const verificationTokenSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        token: {
            type: String,

            require: true,
        },
        createdAt: {
            type: Date,
            expires: 3600,
            default: Date.now,
        },


    }

);




verificationTokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }

    next();
})


verificationTokenSchema.methods.compareToken = async function (token) {
    const result = await bcrypt.compareSync(token, this.password);
    return result;
}

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);