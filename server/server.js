const request = require('request');
const http = require('http');
const url = require('url');
// const crypto = require('./cryptoCoin.js');

exports.Server = class {
    constructor(port) {
        this.port = port;

        http.createServer((req, res) => {
            console.log(req)

            res.writeHead(200, { 'Content-Type': 'application/json' });

            if (req.method && req.method==='GET'){
                res.end(JSON.stringify({"result":"Some data", "method":req.method, "URL": req.url}))
            }
            else if (req.method && req.method==='POST'){
                var body = ''
                req.on('data', (data) => {
                    body += data
                })
                req.on('end', () => {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(JSON.stringify({"result":"Some data", "method":req.method, "content": body}))
                })
                
            }
        }).listen(this.port);
    }

}