var Gamelogic = require('../lib/gamelogic');
var sinon = require('sinon');
var assert = require('assert');
var request = require('request');
var EventEmitter = require('events').EventEmitter;


describe("gamelogic", function() {

	describe("register", function() {
		it("will remember its own id", function(done) {
			var gamelogic = new Gamelogic(123);
			assert.equal(gamelogic.id, 123);
			done();
		});

		it("can assign player numbers", function (done) {
			var gamelogic = new Gamelogic(123);
			assert.ok(gamelogic.hasEmptySlots());

			gamelogic.register(function (err, reply) {
				assert.equal(err, null);
				assert.equal(reply["playerId"], 0);
				assert.equal(reply["roomId"], 123);

				assert.ok(gamelogic.hasEmptySlots());

				gamelogic.register(function (err, reply) {
					assert.equal(err, null);
					assert.equal(reply["playerId"], 1);
					assert.ok(!gamelogic.hasEmptySlots());

					done();
				});
			});
		});
	});

	describe("turn", function() {
		var gamelogic = new Gamelogic();

		before(function (done) {
			gamelogic.register(function () {
				gamelogic.register(function () {
					done();
				});
			});

		});

		it("can accept data blob for a turn", function (done) {

			gamelogic.turn(0, "complexdata", function (err, reply) {
				assert.equal(reply["playerId"], 0);
				assert.equal(reply["turnId"], 1);
				assert.equal(reply["currentPlayerTurnId"], 1);
				done();
			});
		});

		it("can read the turn data back", function (done) {
			gamelogic.getTurn(1, function (err, data) {
				assert.equal(data, "complexdata");
				done();
			});
		});

		it("will not allow to read anything else than the current turn number", function (done) {
			gamelogic.getTurn(2, function (err, data) {
				assert.notEqual(err, null);

				gamelogic.getTurn(0, function (err, data) {
					assert.notEqual(err, null);
					done();
				});
			});
		});

		it("next turn will have next turn id and another currentPlayerTurnId", function (done) {

			gamelogic.turn(1, "complexdata", function (err, reply) {
				assert.equal(reply["playerId"], 1);
				assert.equal(reply["turnId"], 2);
				assert.equal(reply["currentPlayerTurnId"], 0);
				done();
			});
		});		

	});
});
