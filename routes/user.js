const express = require('express');
const router = express.Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

router.post('/signup', body('email').isEmail(),
    body('name').not().isEmpty(),
    body('password').isLength({ min: 8 }),
    body('phone').not().isEmpty(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.json({ error: "email already exists" });

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone
        });
        user.save()
            .then((result) => {
                const token = jwt.sign({ _id: user._id }, process.env.jwt_key, { expiresIn: "24h" });
                return res.json({
                    status: true,
                    body: {
                        token,
                        user: result
                    }
                });
            })
            .catch(err => {
                return res.json({
                    status: false,
                    error: err.message
                });
            });

    });



router.post('/signin',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    });


module.exports = router;
