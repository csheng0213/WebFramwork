/**
 * Created by liulei_dev on 2016/1/27.
 */
var proxy = require('http-proxy').createProxyServer({});

proxy.on(function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
});

var server = require('http').createServer(function (req, res) {
    var host = req.headers.host;
    switch (host) {
        case 'www.keepforward.xyz':
            proxy.web(req, res, {target: 'http://localhost:3000'});
            break;
        case 'keepforward.xyz':
            proxy.web(req, res, {target: 'http://localhost:3000'});
            break;
        default:
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Welcome to my server!');
    }
});

console.log("http-proxy listening on port 80")
server.listen(80);
