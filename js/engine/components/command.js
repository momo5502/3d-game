(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.command = {};
  var commandPool = [];

  ENGINE.command.add = function(name, callback)
  {
    commandPool[name.toLowerCase()] = callback;
  };

  // Executes commands and sets dvars
  // Dvars have higher priority
  ENGINE.command.execute = function(commandline)
  {
    var commands = commandline.split(";");

    for (var i = 0; i < commands.length; i++)
    {
      ENGINE.command.executeByParams(commands[i].trim().split(" "));
    }
  };

  ENGINE.command.executeByParams = function(params)
  {
    if (params.length < 1) return;

    var command = params[0];
    if (ENGINE.dvars.exists(command))
    {
      if (params.length < 2) return;
      ENGINE.dvars.set(params[0], params[1]);
    }
    else if (ENGINE.command.exists(command))
    {
      commandPool[command](params);
    }
  };

  ENGINE.command.exists = function(command)
  {
    return (commandPool[command.toLowerCase()] !== undefined);
  };
})();
