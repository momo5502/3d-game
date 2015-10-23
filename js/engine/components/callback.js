(function()
{
	'use strict';
	window.ENGINE = window.ENGINE || {};

	ENGINE.callbackHandler = function()
  {
    this.callbacks = [];

    this.add = function(callback)
	  {
	    this.callbacks.push(callback);
	  };

    this.run = function(param1, param2, param3, param4, param5)
		{
		  for(var i = 0; i < this.callbacks.length; i++)
		  {
		    this.callbacks[i](param1, param2, param3, param4, param5);
		  }
	  };

    this.clear = function()
	  {
	    this.callbacks = [];
	  };
  };
})();
