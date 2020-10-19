const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('content_Type', 'text/plain');
    res.end('<html lang=""><body><h1>Hello, World!</h1></body></html>');
});
server.listen(port, hostname, () => {

    console.log(`Server running at http://${hostname}:${port}/`);
});
