(function()
{
    'use strict';
    window.ENGINE = window.ENGINE ||
    {};

    ENGINE.model = {};

    ENGINE.model.path = "assets/models/";
    ENGINE.model.extension = ".json";

    ENGINE.model.loader = new THREE.JSONLoader();

    var dbType = "model";

    ENGINE.model.load = function(name)
    {
        var loaded = loadFromDB(name);
        if (loaded != undefined)
        {
            return loaded;
        }

        var ticket = new ENGINE.ticket(name);
        ticket.type = dbType;

        ENGINE.model.loader.load(ENGINE.model.path + name + ENGINE.model.extension, function(geometry, material)
        {
            ticket.geometry = geometry;
            ticket.material = material;
            ticket.close();
        });

        storeDB(name, ticket);
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
