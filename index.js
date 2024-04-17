const http = require('node:http');
const fs = require('node:fs');
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

const server = http.createServer((req, res) => {

    if(req.url === '/'){
        res.statusCode = 200;
        res.method = 'GET';
        res.setHeader('Content-Type', 'text/html');
        
        let data = fs.readFileSync('views/index.html', 'utf-8');
        res.write(data);
    }   

    if(req.url === '/form'){
        res.statusCode = 200;
        res.method = 'GET';
        res.setHeader('Content-Type', 'text/html');
        
        let data = fs.readFileSync('views/form.html', 'utf-8');
        res.write(data);
    }

    if(req.url === '/save' && req.method === 'POST'){
        res.statusCode = 200;
        res.method = 'GET';
        res.setHeader('Content-Type', 'text/html');

        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            body = Buffer.concat(body).toString();
        });


        // //query dinamis untuk insert
        // var name = body.split("&")[0].split("=")[1];
        // var age = body.split("&")[1].split("=")[1];

        // con.query("INSERT INTO student (id, name, age) VALUES (NULL, '"+name+"', "+age+")", function (err, result) {
        //     if (err) throw err;
        //     console.log("1 record inserted");
        // });

        res.write('Data has been saved');
    }

    if(req.url === '/about'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        let data = fs.readFileSync('views/about.html', 'utf-8');
        res.write(data);
    }

    if(req.url === '/contact'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        let data = fs.readFileSync('views/contact.html', 'utf-8');
        res.write(data);
    }

    if(req.url === '/api'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        let data = {
            name: 'John Doe',
            age: 30
        }
        res.write(JSON.stringify(data));
    }

    res.end();

});

server.listen(3000);