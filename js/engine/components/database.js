(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  var db = [];
  ENGINE.database = {};

  ENGINE.database.load = function(type, name)
  {
    if (db[type] == undefined)
    {
      db[type] = [];
    }
    else
    {
      if (db[type][name] != undefined)
      {
        return db[type][name];
      }
    }

    return undefined;
  };

  ENGINE.database.has = function(type, name)
  {
    return (ENGINE.database.load(type, name) != undefined);
  }

  ENGINE.database.add = function(type, name, object)
  {
    ENGINE.database.load(type, name);
    db[type][name] = object;
  };
})();
