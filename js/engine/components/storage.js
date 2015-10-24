(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.storage = {};

  var storageCookiePrefix = "engine_local_storage_";

  // Local storage
  ENGINE.storage.storeLocal = function(name, object)
  {
    return Cookies.set(storageCookiePrefix + name, object,
    {
      expires: 365
    });
  };

  ENGINE.storage.loadLocal = function(name)
  {
    return Cookies.get(storageCookiePrefix + name);
  };

  ENGINE.storage.hasLocal = function(name)
  {
    return (ENGINE.storage.loadLocal(name) != undefined);
  };

  // Remote storage
  // Requires authentication
  // TODO: Implement :P
  ENGINE.storage.storeRemote = function(name, object)
  {
    ENGINE.console.log("Remote storage not implemented yet!");
  };

  ENGINE.storage.loadRemote = function(name, callback)
  {
    ENGINE.console.log("Remote storage not implemented yet!");
  };

  ENGINE.storage.hasRemote = function(name)
  {
    ENGINE.console.log("Remote storage not implemented yet!");
    return false;
  }
})();
