(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  window.GAME.DATA = window.GAME.DATA ||
  {};

  GAME.authentication = {};

  // Step 1: Request to authenticate with username
  GAME.authentication.request = function(username)
  {
    ENGINE.network.authenticationName = username;
    GAME.authentication.username = username;
    ENGINE.console.log("Authenticating as " + username);
    ENGINE.network.send("authenticate", username);
  };

  // Step 2: Verify if username is eligible to authenticate
  ENGINE.network.on('authenticate_response', function(data)
  {
    // User exists
    if (data.success)
    {
      var password = prompt(GAME.authentication.username + ", enter your password");
      if (password === null)
      {
        ENGINE.console.log("Login canceled");
        return;
      }

      // Decrypt private key using password
      if(data.key === undefined)
      {
        alert("ERROR: Server didn't send authentication key!");
      }

      var privateKey = ENGINE.crypto.aes.decrypt(password, atob(data.key));

      while (privateKey.indexOf("-----BEGIN RSA PRIVATE KEY-----") == -1)
      {
        var password = prompt("Invalid password, try again:");
        if (password === null)
        {
          ENGINE.console.log("Login canceled");
          return;
        }

        privateKey = ENGINE.crypto.aes.decrypt(password, atob(data.key));
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
    // User does not exist, request registration
    else
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
        response.userKey = btoa(ENGINE.crypto.aes.encrypt(password, key.private));

        ENGINE.network.send("registration", response);
      });
    }
  });
})();
