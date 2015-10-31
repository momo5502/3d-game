(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.ticketing = {};

  var tickets = [];
  var callbacks = new ENGINE.callbackHandler();

  ENGINE.ticket = function(name)
  {
    this.id = tickets.length;
    this.closed = function()
    {
      return tickets[this.id];
    };
    this.close = closeTicket;
    this.name = name || "";

    tickets[this.id] = false;

    ENGINE.console.log("Ticket (" + this.id + ", " + this.name + ") issued.");
  }

  ENGINE.ticketing.ready = function(callback)
  {
    if (callback != undefined)
    {
      callbacks.add(callback);
    }

    if (!hasOpenTickets())
    {
      ENGINE.console.log("All tickets closed. Running queued callbacks...");
      callbacks.run();
      callbacks.clear();
    }
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function closeTicket()
  {
    if (!this.closed())
    {
      tickets[this.id] = true;
      ENGINE.console.log("Ticket (" + this.id + ", " + this.name + ") closed.");
      ENGINE.ticketing.ready();
    }
  }

  function hasOpenTickets()
  {
    for (var i = 0; i < tickets.length; i++)
    {
      if (!tickets[i])
      {
        return true;
      }
    }

    return false;
  }
})();
