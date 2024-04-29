const http = require('node:http');
const fs = require('node:fs');
const util = require('util');
const { Buffer } = require('node:buffer');

const con = require('./connection');

const server = http.createServer(async (req, res) => {

    if(req.url === '/'){
        res.statusCode = 200;
        res.method = 'GET';
        res.setHeader('Content-Type', 'text/html');
        
        let data = fs.readFileSync('views/index.html', 'utf-8');
        res.write(data);
    }   

    if(req.url === '/form'){
        try {
            res.statusCode = 200;
            res.method = 'GET';
            res.setHeader('Content-Type', 'text/html');
    
            
    
            con.query = util.promisify(con.query)
    
            let data = await con.query("SELECT * FROM student",);
            
            console.log(data)
    
            // let view = fs.readFileSync('views/form.html', 'utf-8');
            // res.write(view);
    
            const stream = fs.createReadStream(process.cwd()+'/views/form.html')
            console.log(toString.call(stream))
            stream.pipe(res)
        } catch (error) {
            console.log(error)
        }
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