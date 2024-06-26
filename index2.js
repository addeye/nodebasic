const http = require('node:http');
const fs = require('node:fs');
const util = require('util');
const { Buffer } = require('node:buffer');

const con = require('./connection');

const blade = (view, data) => {

    const replacementRegex = /\{\{\s*([\w.]+)\s*\}\}/g;

    const students = [
        { id: 1, name: 'John', age: 20 },
        { id: 2, name: 'Alice', age: 22 },
        { id: 3, name: 'Bob', age: 21 }
    ];

    // Penggantian regex untuk mencocokkan {% for ... %} dan {% endfor %}
    const forRegex = /\{%\s*for\s+(.*?)\s+in\s+(.*?)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;

    // Fungsi penggantian untuk mengganti setiap pencocokan regex dengan nilai yang sesuai
    view = view.replace(forRegex, (match, iterator, iterable, body) => {
        let output = '';
        for (const item of students) {
            let replacedBody = body.replace(/{{\s*(.*?)\s*}}/g, (match, key) => {
                return JSON.stringify(item[key.trim()]);
            });
            output += replacedBody;
        }
        return output;
    });

    return view;
}

const httpHandlers = async (req, res) => {
    
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

        var view = fs.readFileSync('views/form.html', 'utf-8');

        var data = await new Promise((resolve, reject) => {
            con.query("SELECT * FROM student", function (err, result, fields) {
                if (err) throw err;
                resolve(result);
            });
        })

        view = blade(view, data);
        
        res.write(view);
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
}

const server = http.createServer(httpHandlers);

server.listen(3000);