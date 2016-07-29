(function()
{
    'use strict';
    window.ENGINE = window.ENGINE ||
    {};

    ENGINE.map = {};

    ENGINE.map.load = function(mapname) {

    };

    ENGINE.map.spawn = function(mapname) {

    };

    // Dynents
    ENGINE.map.dynents = new Array();

    ENGINE.map.dynent = function(object)
    {
        var ent = getDynEntByObject(object);
        if (ent !== undefined)
        {
            return ent;
        }

        this.object = object;

        this.destroy = function()
        {
            ENGINE.map.dynents.splice(ENGINE.map.dynents.indexOf(this), 1);
        };

        // Templates
        this.init = function() {}; // Unused
        this.update = function(delta) {};

        ENGINE.map.dynents.push(this);
    };

    // Unused
    ENGINE.map.dynents.init = function()
    {
        this.forEach(function(entry)
        {
            entry.init();
        });
    };

    ENGINE.map.dynents.update = function(delta)
    {
        this.forEach(function(entry)
        {
            entry.update(delta);
        });
    };

    /****************************/
    /*      Misc functions      */
    /****************************/

    function loadObjects(objects)
    {

    }

    function loadScripts(scripts)
    {

    }

    function getDynEntByObject(object)
    {
        var entity = undefined;
        ENGINE.map.dynents.forEach(function(entry)
        {
            if (entry.object == object)
            {
                entity = entry;
            }
        });

        return entity;
    }
})();
