#!/usr/bin/env node

const busiConfig = require("./app/config/business.config.js");

const cookieParser = require("cookie-parser");
const express = require("express");
// const csv = require('express-csv');
const session = require('express-session');
// const redis = require('redis');
// const connectRedis = require('connect-redis');
const cors = require("cors");
const sql = require("./app/models/db.js");
// var winston = require('winston'),
//     expressWinston = require('express-winston');
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
// const RedisStore = connectRedis(session)
//     //Configure redis client
// const redisClient = redis.createClient({
//     url: `redis://localhost:6379`
// })

// redisClient.on('error', function(err) {
//     console.log('Could not establish a connection with redis. ' + err);
// });
// redisClient.on('connect', function(err) {
//     console.log('Connected to redis successfully');
// });

// app.use(session({
//     store: new RedisStore({ client: redisClient }),
//     secret: 'supersecretgremod',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // if true only transmit cookie over https
//         httpOnly: false, // if true prevent client side JS from reading the cookie 
//         maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds
//     }
// }))

var router = require("./app/routes/routes.js");
// express-winston logger makes sense BEFORE the router
// app.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json()
//     ),
// }));

app.use(router);

// // express-winston errorLogger makes sense AFTER the router.
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json()
//     )
// }));


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