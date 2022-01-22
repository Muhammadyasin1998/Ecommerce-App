const nodemailer = require("nodemailer");
const crypto = require('crypto');
exports.generateOTP = () => {
    let otp = '';
    for (let i = 0; i <= 3; i++) {
        const randomValue = Math.round(Math.random() * 9)
        otp = otp + randomValue;
    }
    return otp;
}


exports.mailTransport = () => nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e8a37eed43a6a7",
        pass: "854f20b75a29d1"
    }
});


module.createRandomBytes = () => new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
        if (err) {
            reject(err);
        }
        else {
            const token = buff.toString('hex')
            resolve(token);
        }
    })
})