const express = require('express');
const router = express.Router();
const { signUpUser, signInUser } = require('../controller/user');
const { createSignUpValidator, createSignInValidator } = require('../validator/index');


router.post('/signup', createSignUpValidator, signUpUser);
router.post('/signin', createSignInValidator, signInUser);


module.exports = router;
