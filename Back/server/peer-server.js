
var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9000,
    path: '/peerjs',
    ssl: {
        key: fs.readFileSync('/etc/ssl/certs/localhost.key', 'utf8'),
        cert: fs.readFileSync('/etc/ssl/certs/localhost.crt', 'utf8')
    }
});