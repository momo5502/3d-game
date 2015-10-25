(function()
{
  'use strict';

  assert(window.jQuery, "jQuery");
  assert(window.THREE, "three.js");
  assert(window.io, "socket.io");
  assert(window.Stats, "stats.js");
  assert(window.Cookies, "js-cookie");
  assert(window.Physijs, "Physijs");

  window.ENGINE = window.ENGINE ||
  {};

  // Order is relevant!
  var components = [
    "callback",
    "ticketing",
    "components",
    "console",
    "database",
    "network",
    "storage",
    "stats",
    "animate",
    "binding",
    "controls",
    "material",
    "shader",
    "model",
    "sound",
  ];

  var callbacks = [];

  ENGINE.NULL = null;
  ENGINE.initialized = false;
  ENGINE.initializing = false;

  ENGINE.init = function(callback)
  {
    // Enable caching for online use!
    $.ajaxSetup(
    {
      cache: false
    });

    // Set physi.js worker
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';

    if (ENGINE.initialized)
    {
      if (callback != undefined)
      {
        callback();
      }
    }
    else
    {
      addCallback(callback);

      if (!ENGINE.initializing)
      {
        ENGINE.initializing = true;
        $(document).ready(function()
        {
          loadComponents();
        });
      }
    }
  };

  ENGINE.ready = function(callback)
  {
    var selfCallback = function()
    {
      ENGINE.ready(callback);
    };

    if (!ENGINE.initialized && !ENGINE.initializing)
    {
      ENGINE.init(selfCallback);
    }
    else if (ENGINE.initializing)
    {
      addCallback(selfCallback);
    }
    else
    {
      ENGINE.console.log("Engine ready.");
      ENGINE.ticketing.ready(callback);
    }
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function assert(object, name)
  {
    if(object === undefined || !object || object === null)
    {
      alert(name + " is not loaded!");
    }
  }

  function addCallback(callback)
  {
    if (callback != undefined)
    {
      callbacks.push(callback);
    }
  }

  function runCallbacks()
  {
    var ticket = new ENGINE.ticket("callbacks");

    for (var i = 0; i < callbacks.length; i++)
    {
      callbacks[i]();
    }

    callbacks = [];

    ticket.close();
  }

  function resolveComponent(component)
  {
    if (component >= components.length) return;
    component = components[component];
    return "js/engine/components/" + component + ".js";
  }

  var currentComponent = 0;

  function loadComponents()
  {
    if (currentComponent < components.length)
    {
      $.getScript(resolveComponent(currentComponent), function(data, textStatus, jqxhr)
      {
        currentComponent++;
        loadComponents();
      });
    }
    else
    {
      ENGINE.initializing = false;
      ENGINE.initialized = true;
      ENGINE.console.log("Engine initialized.");
      runCallbacks();
    }
  }
})();
