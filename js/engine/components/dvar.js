(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  var dvarPool = [];
  ENGINE.dvars = {};

  var dvarValue = function(value)
  {
    this._value = value;
    this._default = value;

    this.set = function(val)
    {
      this._value = val;
    }

    this.get = function()
    {
      return this._value;
    }

    this.reset = function()
    {
      this.set(this._default);
    }
  }

  ENGINE.dvar = function(name, value)
  {
    var dvar = ENGINE.dvars.find(name);
    if (dvar !== undefined)
    {
      dvar.set(value);
      return dvar;
    }

    this.name = name;
    this.value = new dvarValue(value);

    this.get = function()
    {
      return this.value.get();
    };

    this.set = function(value)
    {
      return this.value.set(value);
    };

    dvarPool.push(this);
  };

  ENGINE.dvars.find = function(name)
  {
    for (var i = 0; i < dvarPool.length; i++)
    {
      if (dvarPool[i].name.toLowerCase() == name.toLowerCase())
      {
        return dvarPool[i];
      }
    }

    return undefined;
  };

  // Maybe only set the value if the dvar exists?
  // Automatically convert types
  ENGINE.dvars.set = function(name, value)
  {
    new ENGINE.dvar(name, value);
  };

  ENGINE.dvars.get = function(name)
  {
    var dvar = ENGINE.dvars.find(name);
    if (dvar !== undefined)
    {
      return dvar.value.get();
    }

    return undefined;
  };

  ENGINE.dvars.reset = function(name)
  {
    var dvar = ENGINE.dvars.find(name);
    if (dvar !== undefined)
    {
      dvar.value.reset();
    }
  };

  ENGINE.dvars.exists = function(name)
  {
    return (ENGINE.dvars.find(name) !== undefined);
  }
})();
