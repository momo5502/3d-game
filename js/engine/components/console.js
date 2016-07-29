(function()
{
    'use strict';
    window.ENGINE = window.ENGINE ||
    {};

    ENGINE.console = {};
    ENGINE.console.object = $("#console");

    ENGINE.console.log = function(text)
    {
        console.log(text);
        ENGINE.console.object.append(text + "\n");
        ENGINE.console.scrollDown();
    };

    ENGINE.console.scrollDown = function()
    {
        ENGINE.console.object.scrollTop(ENGINE.console.object[0].scrollHeight);
    }
})();
