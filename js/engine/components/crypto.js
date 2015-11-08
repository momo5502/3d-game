(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.crypto = {};

  ENGINE.crypto.key = function()
  {
    this.bits = undefined;
    this.public = undefined;
    this.private = undefined;

    this.rsa = new RSAKey();

    this.setFromCrypt = function(crypt)
    {
      this.bits = crypt.default_key_size;
      this.crypt = crypt;

      this.setPublicPEM(this.crypt.getPublicKey());
      this.setPrivatePEM(this.crypt.getPrivateKey());
    };

    this.setPublicPEM = function(data)
    {
      this.public = data;
      this.rsa.readPublicKeyFromPEMString(this.public);
    };

    this.setPrivatePEM = function(data)
    {
      this.private = data;
      this.rsa.readPrivateKeyFromPEMString(this.private);
    };
  };

  ENGINE.crypto.generateKey = function(bitsize, callback)
  {
    var crypt = new JSEncrypt(
    {
      default_key_size: bitsize
    });

    if (callback !== undefined)
    {

      crypt.getKey(function()
      {
        var key = new ENGINE.crypto.key();
        key.setFromCrypt(crypt);
        callback(key);
      });
    }
    else
    {
      crypt.getKey();
      var key = new ENGINE.crypto.key();
      key.setFromCrypt(crypt);
      return key;
    }
  };

  ENGINE.crypto.sign = function(key, data, algo)
  {
    return key.rsa.signString(data, (algo || "sha256").toLowerCase());
  };

  ENGINE.crypto.verify = function(key, data, hash)
  {
    return key.rsa.verifyString(data, hash);
  };

  RSAKey.prototype.readPublicKeyFromPEMString = function(string)
  {
    var info = new KJUR.asn1.x509.SubjectPublicKeyInfo();
    info.setRSAPEM(string);
    this.setPublic(info.rsaKey.n, info.rsaKey.e);
  };

  // Signature test
  /*
  ENGINE.crypto.generateKey(2048, function(key)
  {
    var message = "test";
    var signature = ENGINE.crypto.sign(key, message);

    var pubKey = new ENGINE.crypto.key();
    pubKey.setPublicPEM(key.public);

    console.log(ENGINE.crypto.verify(pubKey, message, signature));
  });
  */
})();
