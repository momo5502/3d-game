(function()
{
  'use strict';

  if (!window.jQuery) alert("jQuery not loaded!");
  if (!window.THREE) alert("three.js not loaded!");

  window.ENGINE = window.ENGINE ||
  {};

  // Order is relevant!
  var components = [
    "callback",
    "ticketing",
    "components",
    "database",
    "animate",
    "binding",
    "controls",
    "material",
    "shader",
    "model",
    "sound"
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
      cache: true
    });

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
    if (!ENGINE.initialized && !ENGINE.initializing)
    {
      ENGINE.init(function()
      {
        ENGINE.ready(callback);
      });
    }
    else if (ENGINE.initializing)
    {
      addCallback(function()
      {
        ENGINE.ticketing.ready(callback);
      });
    }
    else
    {
      ENGINE.ticketing.ready(callback);
    }
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

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
      ENGINE.initialized = true;

      runCallbacks();
    }
  }
})();
