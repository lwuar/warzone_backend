var router = require("express").Router();
// const { body, query } = require('express-validator');
const auth = require("../helper/auth.helper");


router.use('/api/basic', require("./basic.routes.js"));

router.use('/api/blog',
    (req, res, next) => auth.verifyToken(req, res, next),
    require("./blog.route.js"));

module.exports = router;