const express = require('express');
const router = express.Router();
const { signUpUser, signInUser, verifyEmail, forgotPassword, resetPassword } = require('../controller/user');
const { createSignUpValidator, createSignInValidator } = require('../validator/validator');

const tokenValidator = require('../validator/user')
const {requireSignin} = require('../validator/helper')
router.post('/signup', createSignUpValidator, signUpUser);
router.post('/signin', createSignInValidator, signInUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password',requireSignin, forgotPassword);
router.post('/reset-password', requireSignin,tokenValidator.isResetTokenValid, resetPassword);


module.exports = router;
