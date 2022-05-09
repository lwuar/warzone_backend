var router = require("express").Router();
const basic = require("../controllers/basic.controller.js");
const { body, query } = require('express-validator');
const auth = require("../helper/auth.helper");

router.post("/login",
    body('username').isString(),
    body('pw_cipher').isString(),
    // body('g-recaptcha-response').optional().isString(),
    // auth.captchaCheck,
    basic.login);


router.post("/register",
    body('username').isString(),
    body('nickname').isString(),
    body('pw_cipher').isString(),
    body('account_level').isInt(),
    basic.register);

router.get("/getProfile",
    (req, res, next) => auth.verifyToken(req, res, next),
    basic.getProfile);

module.exports = router;