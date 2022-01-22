
const { check, validationResult } = require('express-validator');

exports.createSignUpValidator = [
    check('email').normalizeEmail().isEmail().withMessage('Email is not valid'),
    check('name').trim().not().isEmpty().withMessage('Name is missing!').isLength({ min: 3, max: 20 }).withMessage('name must be 3 to 20 characters long!'),
    check('password').trim().not().isEmpty().withMessage('Password is missing!').isLength({ min: 8, max: 20 }).withMessage('password must be 8 to 20 characters long!'),
    check('phone').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (!errors.length) {
            return next();
        }
        return res.status(400).json({ success: false, errors: errors[0].msg });



    }
];

exports.createSignInValidator = [
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
    (req, res, next) => {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();

    }
];


