(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  window.GAME.DATA = window.GAME.DATA ||
  {};

  GAME.authentication = {};

  // Step 1: Request to authenticate with username
  //         and stored session, if available
  GAME.authentication.request = function(username)
  {
    ENGINE.network.authenticationName = username;
    GAME.authentication.username = username;
    ENGINE.console.log("Authenticating as " + username);
    ENGINE.network.send("authenticate",
    {
      user: username,
      session: ENGINE.storage.loadLocal("session") // Try loading session
    });
  };

  // Step 2: Verify if username is eligible to authenticate
  ENGINE.network.on('authenticate_response', function(data)
  {
    // User exists
    if (data.success)
    {
      performAuthentication(data);
    }
    // User does not exist, request registration
    else
    {
      performRegistration(data);
    }
  });

  ENGINE.network.on('authenticate_session', function(data)
  {
    ENGINE.console.log("Authenticated. Session created.");
    ENGINE.storage.storeLocal("session", data.session);
  });

  function performAuthentication(data)
  {
    var password = prompt(GAME.authentication.username + ", enter your password");
    if (password === null)
    {
      ENGINE.console.log("Login canceled");
      return;
    }

    // Decrypt private key using password
    if (data.key === undefined)
    {
      alert("ERROR: Server didn't send authentication key!");
    }

    var privateKey = ENGINE.crypto.aes.decrypt(GAME.authentication.username + password + data.salt, atob(data.key));

    while (privateKey.indexOf("-----BEGIN RSA PRIVATE KEY-----") == -1)
    {
      var password = prompt("Invalid password, try again:");
      if (password === null)
      {
        ENGINE.console.log("Login canceled");
        return;
      }

      privateKey = ENGINE.crypto.aes.decrypt(GAME.authentication.username + password + data.salt, atob(data.key));
    }

    // Generate rsa key
    var rsaKey = new ENGINE.crypto.rsa.key();
    rsaKey.setPrivatePEM(privateKey);

    // Sign token using generated key
    var signature = ENGINE.crypto.rsa.sign(rsaKey, data.token);

    // Perform authentication
    ENGINE.network.send("authentication",
    {
      signature: signature
    });
  }

  function performRegistration(data)
  {
    // Ask user if he wants to register
    if (!confirm("No account with the username " + GAME.authentication.username + " exists, do you want to register it?")) return;

    // Ask for password
    var password = prompt("Enter your password");
    if (password === null)
    {
      alert("Registration canceled!");
      return;
    }

    // Generate rsa key
    ENGINE.console.log("Generating RSA key...");
    ENGINE.crypto.rsa.generateKey(2048, function(key)
    {
      var response = {};
      response.key = key.public;
      response.signature = ENGINE.crypto.rsa.sign(key, data.token);
      response.userKey = btoa(ENGINE.crypto.aes.encrypt(GAME.authentication.username + password + data.salt, key.private));

      ENGINE.network.send("registration", response);
    });
  }
})();
