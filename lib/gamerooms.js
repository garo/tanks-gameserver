
// Gameroom handles how a single server can host multiple games.
//
// Each room is created from RoomPrototype which needs to implement following methods:
//  - register
//  - hasEmptySlots
//
// Rooms are filled in the order where there are empty slots.
// If all rooms are full (or there is no rooms) then a new room is created.
var Gamerooms = module.exports = function (RoomPrototype) {
	this.RoomPrototype = RoomPrototype;
	this.nextRoomId = 1000;
	this.rooms = [];
};

// Finds a suitable room for the player and allocates a player slot
// callback(err, roomId, playerId)
Gamerooms.prototype.findRoomWithSlot = function(cb) {

	var self = this;
	var foundRoom = null;
	for (var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i].hasEmptySlots()) {
			foundRoom = this.rooms[i];
		}
	}

	if (foundRoom === null) {
		foundRoom = new this.RoomPrototype(this.nextRoomId++);
		this.rooms.push(foundRoom);
	}

	foundRoom.register(function (err, roomId, playerId) {
		cb(null, roomId, playerId);
		return;
	});

};

Gamerooms.prototype.findGameRoom = function(roomId, cb) {
	for (var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i].id == roomId) {
			cb(null, this.rooms[i]);
			return;
		}
	}

	cb(new Error("No room " + roomId + " found."));
};
