var fs     = require('fs');
var http   = require('http');
var https  = require('https');
var path   = require("path");
var os     = require('os');
var ifaces = os.networkInterfaces();

var privateKey  = fs.readFileSync('/etc/ssl/certs/localhost.key', 'utf8');
var certificate = fs.readFileSync('/etc/ssl/certs/localhost.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
        }
        
        console.log("");
        console.log("Welcome to the Chat Sandbox");
        console.log("");
        console.log("Test the chat interface from this device at : ", "https://localhost:8443");
        console.log("");
        console.log("And access the chat sandbox from another device through LAN using any of the IPS:");
        console.log("Important: Node.js needs to accept inbound connections through the Host Firewall");
        console.log("");

        if (alias >= 1) {
            console.log("Multiple ipv4 addreses were found ... ");
            console.log(ifname + ':' + alias, "https://"+ iface.address + ":8443");
        } else {
            console.log(ifname, "https://"+ iface.address + ":8443");
        }

        ++alias;
    });
});

var LANAccess = "0.0.0.0";

httpServer.listen(8080, LANAccess);

httpsServer.listen(8443, LANAccess);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/resources', express.static('./source'));