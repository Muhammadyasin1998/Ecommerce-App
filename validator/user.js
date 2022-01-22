const { isValidObjectId } = require('mongoose')
const User = require('../models/user')
const ResetPasswordToken = require('../models/reset_password')
// const  {isValidObjectId} = require('mongoose').isValidObjectId();
const bcrypt = require('bcryptjs');

exports.isResetTokenValid = async (req, res, next) => {
    //get token and id
    const { token, id } = req.query;

    if (!token || !id) return res.send('invalid request');
    // if (!isValidObjectId(id)) return res.send('invalid user id');


    const user = await User.findById(id);
    if (!user) return res.send('user not found');

    const resetToken = await ResetPasswordToken.findOne({ owner: user._id })
    if (!resetToken) return res.send('token not found');

    const isValidToken = bcrypt.compareSync(token, resetToken.token);
    if (!isValidToken) return res.send('token not valid');

    req.user = user;
    next();

}