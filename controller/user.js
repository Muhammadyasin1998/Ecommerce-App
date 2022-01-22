const jwt = require('jsonwebtoken');
const helpers = require('../helper/mail')
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const User = require('../models/user')
const VerificationToken = require('../models/verificationtoken')
const ResetPasswordToken = require('../models/reset_password')



///
///=======================Register new user =================================
///

exports.signUpUser = async (req, res) => {

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.json({ error: "email already exists" });

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    });


    const OTP = helpers.generateOTP()
    console.log(OTP
    )
    const verificatioToken = new VerificationToken({
        owner: user._id,
        token: OTP
    });

    console.log(OTP)

    verificatioToken.save().then(
        (vrtoken) => {
            user.save()
                .then((result) => {


                    const token = jwt.sign({ _id: user._id }, process.env.jwt_key, { expiresIn: "24h" });


                    return res.json({
                        status: true,
                        OTP: OTP,
                        body: {
                            token,
                            user: result,
                            vrtoken

                        }
                    });
                })
                .catch(err => {
                    return res.json({
                        status: false,
                        error: err.message
                    });
                });
        }
    ).catch(err => { res.send({ error: err.message }) });


}




///
///=======================Login userr =================================
///

exports.signInUser = async (req, res) => {


    const { email, } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) return res.json({ error: "user not found" });
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ _id: user._id }, process.env.jwt_key, { expiresIn: "24h" });
                return res.json({
                    success: "logged in successfully",
                    body: {
                        token: token,
                        user
                    }
                });
            } else {
                return res.send('passwordHash mismatch')
            }
        })
        .catch((err) => {
            if (err) return res.json({ message: err.message });
        });
}





///
///=======================Verify email by Otp =================================
///
exports.verifyEmail = async (req, res, next) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.send('invalid request , missing parameters');
    const user = await User.findById(userId);


    if (!user) return res.send('user not found');

    if (user.verified) return res.send('user verified');



    const token = await VerificationToken.findOne({ owner: user._id });

    if (!token) return res.send('sorry user not found');
    console.log(`otp : >${token.token}`);

    const isMatched = bcrypt.compareSync(otp, token.token);


    if (!isMatched) return res.send('otp not found');


    user.verified = true;

    await VerificationToken.findByIdAndDelete(token._id);
    user.save().then(
        res.send('user verified!')
    ).catch((err) => { res.send(err.message) });
}





///
///=======================Forgot Password =================================
///
exports.forgotPassword = async (req, res) => {


    const { email } = req.body;
    if (!email) return res.send('please provide a valid email');


    const user = await User.findOne({ email });
    if (!user) return res.send('user not found');



    const token = await ResetPasswordToken.findOne({ owner: user._id });
    if (token) return res.send('after one hour you can request to another token!');



    const randomBytes = crypto.randomBytes(32).toString("hex")
    console.log(randomBytes);

    const resetToken = new ResetPasswordToken({ owner: user._id, token: randomBytes });
    resetToken.save().then((result) => {
        res.json({
            status: 'success',
            token: randomBytes,
            id: user._id,

        })

    }).catch((err) => {

        res.send(err.message)
    });






}




///
///=======================Reset password=================================
///
exports.resetPassword = async (req, res, next) => {
    const { password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.send('user not found');

    const isPasswordSame = bcrypt.compareSync(password, user.password);
    if (isPasswordSame) return res.send('new password must be different');
    if (password.trim().lenght < 8 || password.trim().length > 20) return res.send('password must be at least 8 characters')
    user.password = password.trim();
    console.log(`user password ${user._id}`)
    await user.save();

    ResetPasswordToken.findOneAndDelete({ owner: user._id }).then(result => {
        res.send('passwor change successful')
    }).catch(err => {
        res.send(err);
    });




}


























