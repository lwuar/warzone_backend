var router = require("express").Router();
// const { body, query } = require('express-validator');
const { ADMIN_USER, GOV_USER, BASIC_USER } = require("../config/default.config.js");


router.use('/api/basic', require("./basic.routes.js"));


module.exports = router;