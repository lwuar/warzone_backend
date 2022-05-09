#!/usr/bin/env node

const busiConfig = require("./app/config/business.config.js");

const cookieParser = require("cookie-parser");
const express = require("express");

const cors = require("cors");
const sql = require("./app/models/db.js");

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger-output.json');

var corsOptions = {
    origin: `http://${busiConfig.DOMAIN}:8090`
};

app.use(cors(corsOptions));
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

app.set('trust proxy', 1);


var router = require("./app/routes/routes.js");


app.use(router);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


// set port, listen for requests
module.exports = {
    app: app,
    // redis: redisClient,
    sql: sql
}