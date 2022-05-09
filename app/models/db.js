const mysql = require('mysql2');
const dbConfig = require("../config/db.config.js");
const util = require("util");

var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

connection.nonPromiseQuery = connection.query;
connection.promiseQuery = util.promisify(connection.query);

connection.query = (query, args, callback) => {
    if (callback) {
        connection.nonPromiseQuery(query, args, callback);
    } else {
        return connection.promiseQuery(query, args);
    }
}

module.exports = connection;