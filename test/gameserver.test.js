var Gameserver = require('../lib/gameserver');
var sinon = require('sinon');
var assert = require('assert');
var request = require('request');
var EventEmitter = require('events').EventEmitter;

var PORT = 3100;

describe("gameserver", function() {
  var gameserver = new Gameserver(PORT);

  it("can start", function (done) {

    gameserver = new Gameserver(PORT);
    gameserver.start(function (err) {
      assert.equal(err, null);
      gameserver.shutdown(function (err) {
        done();
      });
    });

  });

  it("can start and will return http response from /", function (done) {
    gameserver.start(function (err) {
      request("http://localhost:" + PORT + "/",
          function (err, response, body) {

          assert.equal(body, "OK");
          gameserver.shutdown(function (err) {
          done();
        });

      });
    });

  });

  it("will reply with CORS headers", function (done) {
    gameserver.start(function (err) {
      request("http://localhost:" + PORT + "/",
          function (err, response, body) {

          assert.equal(response.headers["access-control-allow-origin"], "*");
          assert.equal(response.headers["access-control-allow-methods"], "PUT, POST, GET, OPTIONS");
          assert.equal(response.headers["access-control-allow-headers"], "Origin, X-Requested-With, Content-Type, Accept");

          gameserver.shutdown(function (err) {
            done();
        });

      });
    });

  });

  describe("serving games", function (done) {
    before(function(done) {
      gameserver.start(done);
    });

    after(function(done) {
      gameserver.shutdown(done);
    });

    it("allows registering to a game and get a slot", function(done) {
      request.post("http://localhost:" + PORT + "/v1/rooms", function(err, response, body) {
        data = JSON.parse(body);
        assert.equal(data["roomId"], 1000);
        assert.equal(data["playerId"], 0);
        done();
      });
    });

    it("allows another player to join the same game", function(done) {
      request.post("http://localhost:" + PORT + "/v1/rooms", function(err, response, body) {
        data = JSON.parse(body);
        assert.equal(data["roomId"], 1000);
        assert.equal(data["playerId"], 1);
        done();
      });
    });

    it("allows to send a played turn to the server", function(done) {
      request.put({
        uri: "http://localhost:" + PORT + "/v1/rooms/1000/players/0/turn",
        body: "complexpayload"}, function(err, response, body) {
        data = JSON.parse(body);

        assert.equal(data["roomId"], 1000);
        assert.equal(data["playerId"], 0);
        assert.equal(data["turnId"], 1);
        assert.equal(data["currentTurnPlayerId"], 1);
        done();
      });
    });

    it("allows to get a played turn from the server", function(done) {
      request.get("http://localhost:" + PORT + "/v1/rooms/1000/players/0/turn/1", function(err, response, body) {
        var data = JSON.parse(body);
        assert.equal(data["data"], "complexpayload");
        done();
      });
    });


  });
});
