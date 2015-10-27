(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.chat = {};

  ENGINE.chat.sendMessage = function(username, message)
  {
    if(message === undefined || message == null) return;

    ENGINE.network.send("chatmessage", message);
    pushMessage(username, message);
  };

  ENGINE.network.on("chatmessage", function(data, socket)
  {
    pushMessage(data.user, data.message);
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
    var dataContainer = $("<span />",
    {
      class: "content",
      text: message
    });

    messageContainer.hide();

    userContainer.appendTo(messageContainer);
    dataContainer.appendTo(messageContainer);
    messageContainer.appendTo("#chatlog");
    messageContainer.fadeIn(200);

    hideOverTime(messageContainer, 10000);
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
    if(objects.length >= 7)
    {
      hideOverTime(objects.slice(0, objects.length - 6), 0);
    }
  }

})();
