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
});
