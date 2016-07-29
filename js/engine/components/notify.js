/**
 * Inspired by THREEx windowresize
 */

(function()
{
    'use strict';
    window.ENGINE = window.ENGINE ||
    {};

    ENGINE.notify = {};

    var icons = [];
    icons["notify-success"] = "fa-check";
    icons["notify-info"] = "fa-info";
    icons["notify-warn"] = "fa-exclamation";
    icons["notify-error"] = "fa-times";

    ENGINE.notify.info = function(message)
    {
        createNotification(message, "notify-info");
    }

    ENGINE.notify.success = function(message)
    {
        createNotification(message, "notify-success");
    }

    ENGINE.notify.warn = function(message)
    {
        createNotification(message, "notify-warn");
    }

    ENGINE.notify.error = function(message)
    {
        createNotification(message, "notify-error");
    }

    function createNotification(message, color)
    {
        var object = $("<div />",
        {
            class: color
        });

        var icon = $("<i />",
        {
            class: "fa " + icons[color],
        });

        var message = $("<span />",
        {
            text: message
        });

        icon.appendTo(object);
        message.appendTo(object);

        display(object);
        hideOverTime(object, 7000);
    }

    function display(object)
    {
        object.prependTo("#notifications");
        object.slideDown(200, object.fadeTo.bind(object, 200, 1));
    }

    function hideOverTime(object, time)
    {
        setTimeout(function()
        {
            object.fadeTo(300, 0, object.remove.bind(object));
        }, time);
    }
})();
