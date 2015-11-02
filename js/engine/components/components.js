(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.components = {};

  ENGINE.components.loader = function(path, components, done)
  {
    this.path = path;
    this.callback = done;
    this.components = components;
    this.componentTickets = [];
    this.currentComponent = 0;
    this.loadingDone = function()
    {
      for (var i = 0; i < this.componentTickets.length; i++)
      {
        var ticket = this.componentTickets[i];
        if (!ticket.closed())
        {
          ticket.close();
        }
      }

      this.callback();
    };

    for (var i = 0; i < this.components.length; i++)
    {
      this.componentTickets[i] = new ENGINE.ticket(this.components[i]);
    }

    var self = this;

    this.chainload = function()
    {
      if (this.currentComponent < this.components.length)
      {
        var file = this.path + this.components[this.currentComponent] + ".js";

        $.getScript(file, function(data, textStatus, jqxhr)
        {
          self.componentTickets[self.currentComponent].close();
          self.currentComponent++;
          self.chainload();
        });
      }
      else
      {
        this.loadingDone();
      }
    };
  };

  ENGINE.components.load = function(path, components)
  {
    var ticket = new ENGINE.ticket("components");

    new ENGINE.components.loader(path, components, function()
    {
      ticket.close();
    }).chainload();
  };
})();
