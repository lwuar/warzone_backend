const defaultConfig = require("../config/default.config.js");
const busiConfig = require("../config/business.config.js");
const CurDate = require("./date.helper.js");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
// Google Auth
// const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = busiConfig.CLIENT_ID;
// const client = new OAuth2Client(CLIENT_ID);
// const fetch = require("isomorphic-fetch");

function getToken(uid, username, account_level) {
    nounce = crypto.randomBytes(16).toString('hex');
    const token = jwt.sign({
        token_uid: uid,
        token_username: username,
        token_account_level: account_level,
        token_nounce: nounce
    }, "YOUR_SECRET_KEY", {
        expiresIn: '1d'
    });
    return token;
}

function verifyToken(req, res, next) {

    try {
        const token = req.cookies.access_token;
        const data = jwt.verify(token, "YOUR_SECRET_KEY");
        // Almost done

        req.uid = data.token_uid;
        req.username = data.token_username;
        req.account_level = data.token_account_level;
        req.nounce = data.token_nounce;

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(403);
    }
}

// async function tokenCheck(token) {
//     const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
//     });
//     const payload = ticket.getPayload();

//     return payload;
// }


function emailCheck(email) {
    const suffix = email.split("@")[1];
    return busiConfig.EMAIL_SUFFIX.includes(suffix);
}


// var captchaCheck = (req, res, next) => {
//     if (busiConfig.REQUIRE_CAPTCHA == false)
//         return next();
//     else
//         return fetch(busiConfig.CAPTCHA_VERIFY_URL, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                 body: `secret=${busiConfig.CAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`,
//             })
//             .then(response => response.json())
//             .then((google_response) => {
//                 // google_response is the object return by
//                 // google as a response
//                 if (google_response.success == true) {
//                     //   if captcha is verified
//                     console.log("correct captcha", google_response)
//                     return next();
//                 } else {
//                     // if captcha is not verified
//                     console.log("failed captcha", google_response)
//                     return res.status(500).send({ message: "Wrong Captcha" });
//                 }
//             })
//             .catch((error) => {
//                 // Some error while verify captcha
//                 console.log("some error in captcha", error)
//                 return res.status(500).json({ message: "Wrong Captcha" });
//             });
// }

module.exports = {
    // tokenCheck,
    emailCheck,
    verifyToken,
    getToken
    // captchaCheck
}