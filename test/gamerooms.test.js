var Gamerooms = require('../lib/gamerooms');
var sinon = require('sinon');
var assert = require('assert');
var request = require('request');
var EventEmitter = require('events').EventEmitter;


describe("gamerooms", function() {

	var Mock = function(id) {
		this.id = id;
		this.players = 0;
	};

	Mock.prototype.hasEmptySlots = function() {
		return this.players < 2;
	};

	Mock.prototype.register = function(cb) {
		cb(null, this.id, this.players++);
	};	

	describe("findRoomWithSlot", function() {
		it("can find a room where fits", function(done) {

			var gamerooms = new Gamerooms(Mock);
			gamerooms.findRoomWithSlot(function (err, room_id, player_id) {
				assert.equal(room_id, 1000);

				done();
			});
		});

		it("will place two concecutive players into same room", function(done) {
			var gamerooms = new Gamerooms(Mock);
			gamerooms.findRoomWithSlot(function (err, room_id, player_id) {
				assert.equal(player_id, 0);
				assert.equal(room_id, 1000);

				gamerooms.findRoomWithSlot(function (err, room_id2, player_id) {
					assert.equal(player_id, 1);
					assert.equal(room_id2, 1000);

					// But not 3rd
					gamerooms.findRoomWithSlot(function (err, room_id3, player_id) {
						assert.equal(player_id, 0);
						assert.notEqual(room_id3, 1000);
						done();
					});
				});
			});
		});		
	});
	
});
