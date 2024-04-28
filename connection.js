var mysql = require('mysql');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodebasicdb",
    connectionLimit: 10
});

module.exports = pool;