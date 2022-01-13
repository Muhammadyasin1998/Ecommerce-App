
const { check, validationResult } = require('express-validator');

exports.createSignUpValidator = [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('password').isLength({ min: 8 }),
    check('phone').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();

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


