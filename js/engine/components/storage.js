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
        var data = JSON.stringify(object);
        data = LZString.compress(data);

        return store.set(storageCookiePrefix + name, data);
    };

    ENGINE.storage.loadLocal = function(name)
    {
        var data = store.get(storageCookiePrefix + name);

        if (data !== undefined)
        {
            data = LZString.decompress(data);
            data = JSON.parse(data);
        }

        return data;
    };

    ENGINE.storage.hasLocal = function(name)
    {
        return (ENGINE.storage.loadLocal(name) !== undefined);
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
