
var expressjwt = require('express-jwt');

exports.requireSignin = expressjwt({
    secret: process.env.jwt_key,
    algorithms: ['HS256'],
    userProperty: "auth"
});