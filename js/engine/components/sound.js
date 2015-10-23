(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.sound = {};

  ENGINE.sound.path = "assets/sounds/";
  ENGINE.sound.extension = ".ogg";

  var dbType = "sound";

  ENGINE.sound.load = function(name)
  {
    var loaded = loadFromDB(name);
    if (loaded != undefined)
    {
      return loaded;
    }

    var ticket = new ENGINE.ticket(name);
    ticket.type = dbType;

    ticket.audio = new Audio(ENGINE.sound.path + name + ENGINE.sound.extension);
    ticket.audio.load();

    ticket.audio.addEventListener("loadeddata", function()
    {
      ticket.close();
    }, false);

    storeDB(name, ticket);
    return ticket;
  };

  ENGINE.sound.play = function(name)
  {
    var ticket = ENGINE.sound.load(name);
    ticket.audio.play();
    return ticket;
  };

  ENGINE.sound.stop = function(name)
  {
    var ticket = ENGINE.sound.load(name);
    ticket.audio.stop();
    return ticket;
  };

  ENGINE.sound.playLoop = function(name)
  {
    var ticket = ENGINE.sound.play(name);
    ticket.audio.loop = true;
    ticket.audio.play();
    return ticket;
  };

  ENGINE.sound.stopLoop = function(name)
  {
    var ticket = ENGINE.sound.stop(name);
    ticket.audio.loop = false;
    ticket.audio.stop();
    return ticket;
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function loadFromDB(name)
  {
    return ENGINE.database.load(dbType, name);
  }

  function storeDB(name, object)
  {
    return ENGINE.database.add(dbType, name, object);
  }
})();
