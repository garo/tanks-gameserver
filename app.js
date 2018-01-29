var Gameserver = require('./lib/gameserver');

var gameserver = new Gameserver(3100);

gameserver.start(function(err) {
  console.log("Gameserver startd");
});

