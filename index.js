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
    
        // Melakukan query ke database untuk mendapatkan data yang ingin ditampilkan
        var data = con.query("SELECT * FROM student", function (err, result, fields) {
            if (err) {
                console.error("Error occurred while fetching data:", err);
                // Tambahkan penanganan kesalahan di sini
                return;
            }
            console.log(result[0].name);
    
            let data = fs.readFileSync('views/form.html', 'utf-8');
    
            // Memasukkan data dari hasil query ke dalam form.html
            data = data.replace('{name}', result[0].name); 
            // data = data.replace('{age}', result[0].age); 
            
            console.log(data);
    
            // Mengirim halaman HTML yang telah diperbarui dengan data dari database
            res.write(data);
            return res.end();
        });

        console.log(data);
    }

    if (req.url === '/save' && req.method === 'POST') {
        
    
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
    
        req.on('end', () => {
            body = Buffer.concat(body).toString();
    
            // Parsing data dari form
            const formData = {};
            body.split('&').forEach(keyValue => {
                const [key, value] = keyValue.split('=');
                formData[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            });
    
            // Menyimpan data ke dalam database
            con.query("INSERT INTO student (id, name, age) VALUES (NULL, ?, ?)", [formData.name, formData.age], function (err, result) {
                if (err) {
                    res.write('Error occurred while saving data');
                    return res.end('Error occurred while saving data');
                }
                console.log("1 record inserted");
                return res.end('Data has been saved');
                
            });
        });

        res.statusCode = 302; // 302 Found (temporary redirect)
        res.setHeader('Location', '/form'); // Redirect to success page
        return res.end();
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