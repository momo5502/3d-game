(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.chat = {};

  var _username = "You";

  ENGINE.chat.setUsername = function(username)
  {
    _username = username;
  };

  ENGINE.chat.sendMessage = function(message)
  {
    if (message === undefined || message == null) return;

    ENGINE.network.send("chatmessage", message);
    pushMessage(_username, message);
  };

  ENGINE.network.on("chatmessage", function(data, socket)
  {
    pushMessage(data.name, data.message);
  });

  function pushMessage(user, message)
  {
    hideExceedingMessages();
    var messageContainer = $("<span />",
    {
      class: "message"
    });
    var userContainer = $("<span />",
    {
      class: "user",
      text: user
    });
    var dataContainer = evalCodColorCode(message);

    messageContainer.hide();

    userContainer.appendTo(messageContainer);
    dataContainer.appendTo(messageContainer);
    messageContainer.appendTo("#chatlog");
    messageContainer.fadeIn(200);

    hideOverTime(messageContainer, 15000);
  }

  function evalCodColorCode(message)
  {
    var parsed = message.split("^");

    var elem = $("<span />",
    {
      class: "content"
    });

    var lastElem = getNeutralColorElement(parsed[0])
    lastElem.appendTo(elem);

    for (var i = 1; i < parsed.length; i++)
    {
      var string = parsed[i];
      var color = string[0];

      if (isNaN(color))
      {
        string = "^" + string;
        getNeutralColorElement(string).appendTo(lastElem);
      }
      else
      {
        string = string.substring(1);
        lastElem = getColorElement(string, color);
        lastElem.appendTo(elem);
      }
    }

    return elem;
  }

  function getNeutralColorElement(message)
  {
    return $("<span />",
    {
      text: message
    });
  }

  function getColorElement(message, color)
  {
    return $("<span />",
    {
      text: message,
      class: "color_" + color
    });
  }

  function hideOverTime(object, time)
  {
    setTimeout(function()
    {
      object.fadeTo(200, 0, function()
      {
        object.slideUp(200, function()
        {
          object.remove();
        });
      });
    }, time);
  }

  function hideExceedingMessages()
  {
    var objects = $("#chatlog .message");
    if (objects.length >= 7)
    {
      hideOverTime(objects.slice(0, objects.length - 6), 0);
    }
  }

})();
