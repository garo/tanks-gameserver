var express = require('express')
var app = express()
var port = 3000

//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());
var playerId = 0;
var state = "INIT";

var currentTurnPlayerId = 0;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
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

var lastTurn = {
    "playerId" : 0,
    "turnId" : 0,
    "data" : null
};

app.get('/end', function (request, response) {
    console.log("round ended");
    currentTurnPlayerId = 0;
    lastTurn["turnId"] = 0;
    lastTurn["playerId"] = 0;
    lastTurn["data"] = 0;
    response.send("OK");
});

app.get('/register', function (request, response) {
    console.log("/register");
    data = {
        "playerId" : playerId
    };

    playerId += 1;
    if (playerId > 1) {
        playerId = 0;
    }
    console.log(state, data);
    response.send(JSON.stringify(data));

});


app.put('/turn/:playerId', function (request, response) {
    console.log("/turn for " + request.params["playerId"]);

    console.log(request.body);
    lastTurn["playerId"] = parseInt(request.params["playerId"]);
    lastTurn["data"] = JSON.parse(request.body);
    lastTurn["turnId"]++;

    currentTurnPlayerId++;
    if (currentTurnPlayerId > 1) {
        currentTurnPlayerId = 0;
    }

    data = {
        "playerId" : playerId,
        "turnId" : lastTurn["turnId"],
        "currentTurnPlayerId" : currentTurnPlayerId
    };

    console.log(state, lastTurn);
    response.send(JSON.stringify(data));

});

app.get('/turn/:id', function (request, response) {
    console.log("Checking if turn " + request.params.id + " has been played. current turn is: " + lastTurn["turnId"]);
    if (lastTurn['turnId'] == request.params.id) {
        //response.send(JSON.stringify(lastTurn));
        response.send(JSON.stringify(lastTurn["data"]));
    }
    response.end();
});

app.listen(port, function (err) {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log("server is listening on " + port);
});
