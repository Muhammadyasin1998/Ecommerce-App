const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const User = require('../models/user')

exports.signUpUser = async (req, res) => {

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
}


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


