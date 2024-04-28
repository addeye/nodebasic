// create sql table students
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodebasicdb"
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connected!");
});

// query sql create table students
con.query("CREATE TABLE student (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT)", function (err, result) {
    if (err) throw err;
    console.log("Table created");
})