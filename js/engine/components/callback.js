(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.callbackHandler = function()
  {
    this.callbacks = [];

    this.add = function(callback)
    {
      this.callbacks.push(callback);
    };

    this.run = function()
    {
      for (var i = 0; i < this.callbacks.length; i++)
      {
        this.callbacks[i].apply(this, arguments);
      }
    };

    this.clear = function()
    {
      this.callbacks = [];
    };
  };
})();
