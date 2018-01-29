
var express = require('express');

var Gameserver = module.exports = function (port) {
    this.port = port;

    this.app = express();
    this.server = null;

    // Handle CORS headers
    this.app.use(function (req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       next();
    });
    this.app.get("/", function (req, res) {
        res.send("OK");
    });


};

Gameserver.prototype.start = function(done) {
    this.server = this.app.listen(this.port, function(err) {

        done(err);
    });
};

Gameserver.prototype.shutdown = function(done) {
    this.server.close();
    done();
};
