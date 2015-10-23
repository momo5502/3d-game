(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.components = {};

  ENGINE.components.loader = function(path, components, done)
  {
    this.path = path;
    this.components = components;
    this.currentComponent = 0;
    this.loadingDone = done;

    var self = this;

    this.chainload = function()
    {
      if (this.currentComponent < this.components.length)
      {
        var file = this.path + this.components[this.currentComponent] + ".js";

        $.getScript(file, function(data, textStatus, jqxhr)
        {
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
