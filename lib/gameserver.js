
var express = require('express');
var Gamelogic = require('./gamelogic');
var Gamerooms = require('./gamerooms');

var Gameserver = module.exports = function (port) {
    this.port = port;

    this.app = express();
    this.server = null;
    this.gamerooms = new Gamerooms(Gamelogic);
    var self = this;

    // Handle CORS headers
    this.app.use(function (req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       next();
    });

    this.app.use(function (req, res, next) {
        var data = '';
        req.setEncoding('utf8');
        req.on('data', function(c) {
            data += c;
        });
        req.on('end', function() {
            req.body = data;
            next();
        });
    });

    this.app.get("/", function (req, res) {
        res.send("OK");
    });

    this.app.post("/v1/rooms", this.handleRegister.bind(this));
    this.app.put("/v1/rooms/:roomId/players/:playerId/turn", this.handleTurn.bind(this));
    this.app.get("/v1/rooms/:roomId/players/:playerId/turn/:turnId", this.handleGetTurn.bind(this));


};

Gameserver.prototype.handleRegister = function (req, res) {
    this.gamerooms.findRoomWithSlot(function (err, roomId, playerId) {
        if (err) {
            res.end(err);
            return;
        }

        res.send({
            "roomId" : roomId,
            "playerId" : playerId
        });
    });

};

Gameserver.prototype.handleTurn = function (req, res) {
    this.gamerooms.findGameRoom(req.params.roomId, function (err, room) {
        if (err) {
            res.end(err);
            return;
        }

        room.turn(req.params.playerId, req.body, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });

    });

};

Gameserver.prototype.handleGetTurn = function (req, res) {
    this.gamerooms.findGameRoom(req.params.roomId, function (err, room) {
        if (err) {
            res.end(err);
            return;
        }

        room.getTurn(req.params.turnId, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });

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
