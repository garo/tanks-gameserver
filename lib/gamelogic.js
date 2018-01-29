
// Gamelogic handles what happens within a single game between players.
// It's main focus is to track which players turn it is and relay replay information
// to another player(s).
var Gamelogic = module.exports = function (id) {
	this.id = id;
	this.nextAvailablePlayerId = 0;
	this.currentTurnPlayerId = 0;
	this.lastTurn = {
		"turnId" : 0,
		"data" : null,
		"playerId" : null
	};

	this.maxPlayers = 2;

};

// register player to this room. will allocate an unique playerId, starting from 0.
// callback(err, data) where data is reply data to client
Gamelogic.prototype.register = function(done) {
	var id = this.nextAvailablePlayerId++;
	done(null, {
		"roomId" : this.id,
		"playerId" : id
	});
};

// send turn to the server.
// playerId: The playerId who executed this turn
// payload: Arbitrary payload which will be relayed to other players
// callback(err, data) where data is reply data to client.
Gamelogic.prototype.turn = function(playerId, payload, cb) {
	this.lastTurn["data"] = payload;
	this.lastTurn["playerId"] = playerId;
	this.lastTurn["turnId"]++;

	this.currentTurnPlayerId++;
    if (this.currentTurnPlayerId >= this.nextAvailablePlayerId) {
        this.currentTurnPlayerId = 0;
    }

	cb(null, {
		"playerId" : playerId,
		"turnId" : this.lastTurn["turnId"],
		"currentPlayerTurnId" : this.currentTurnPlayerId
	});
};

// Gets a turn from the server.
// turnNumber: Number of the turn which the client wants. Any other turn number
// than current turn number will return an error.
// callback(err, payload)
Gamelogic.prototype.getTurn = function(turnNumber, cb) {
	if (turnNumber != this.lastTurn["turnId"]) {
		cb(new Error("Invalid turnId"));
	} else {
		cb(null, this.lastTurn["data"]);
	}
};

// Returns true if this game has empty player slots.
Gamelogic.prototype.hasEmptySlots = function() {
	return this.nextAvailablePlayerId < this.maxPlayers;
};

