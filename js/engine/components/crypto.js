(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.crypto = {};
  ENGINE.crypto.aes = {};
  ENGINE.crypto.rsa = {};

  ENGINE.crypto.rsa.key = function()
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

  ENGINE.crypto.rsa.generateKey = function(bitsize, callback)
  {
    var crypt = new JSEncrypt(
    {
      default_key_size: bitsize
    });

    if (callback !== undefined)
    {

      crypt.getKey(function()
      {
        var key = new ENGINE.crypto.rsa.key();
        key.setFromCrypt(crypt);
        callback(key);
      });
    }
    else
    {
      crypt.getKey();
      var key = new ENGINE.crypto.rsa.key();
      key.setFromCrypt(crypt);
      return key;
    }
  };

  ENGINE.crypto.rsa.sign = function(key, data, algo)
  {
    return key.rsa.signString(data, (algo || "sha256").toLowerCase());
  };

  ENGINE.crypto.rsa.verify = function(key, data, hash)
  {
    return key.rsa.verifyString(data, hash);
  };

  ENGINE.crypto.aes.encrypt = function(key, data)
  {
    var keyHash = ENGINE.crypto.sha256(key, true);

    var keyArray = [];
    var dataArray = [];

    for (var i = 0; i < keyHash.length; i++)
    {
      keyArray.push(keyHash.charCodeAt(i));
    }

    var block = [];
    var blocks = [];
    for (var i = 0; i < data.length; i++)
    {
      if (i % 16 == 0 && i != 0)
      {
        blocks.push(block);
        block = [];
      }

      block.push(data.charCodeAt(i));
    }

    blocks.push(block);

    AES_Init();

    AES_ExpandKey(keyArray);

    for (var i = 0; i < blocks.length; i++)
    {
      block = blocks[i];
      AES_Encrypt(block, keyArray);
      dataArray = dataArray.concat(block);
    }

    AES_Done();

    data = "";
    for (var i = 0; i < dataArray.length; i++)
    {
      data += String.fromCharCode(dataArray[i]);
    }

    return data;
  };

  ENGINE.crypto.aes.decrypt = function(key, data)
  {
    var keyHash = ENGINE.crypto.sha256(key, true);

    var keyArray = [];
    var dataArray = [];

    for (var i = 0; i < keyHash.length; i++)
    {
      keyArray.push(keyHash.charCodeAt(i));
    }

    var block = [];
    var blocks = [];
    for (var i = 0; i < data.length; i++)
    {
      if (i % 16 == 0 && i != 0)
      {
        blocks.push(block);
        block = [];
      }

      block.push(data.charCodeAt(i));
    }

    blocks.push(block);

    AES_Init();

    AES_ExpandKey(keyArray);

    for (var i = 0; i < blocks.length; i++)
    {
      block = blocks[i];
      AES_Decrypt(block, keyArray);
      dataArray = dataArray.concat(block);
    }

    AES_Done();

    data = "";
    for (var i = 0; i < dataArray.length; i++)
    {
      data += String.fromCharCode(dataArray[i]);
    }

    return data;
  };

  ENGINE.crypto.sha256 = function(data, asBytes)
  {
    var hash = KJUR.crypto.Util.sha256(data);

    if (asBytes !== undefined && asBytes)
    {
      hash = unescape((hash).replace(/(..)/g, '%$1'));
    }

    return hash;
  };
})();

// Expand jsrsasign's RSAKey structure to enable PEM public key loading
RSAKey.prototype.readPublicKeyFromPEMString = function(string)
{
  var info = new KJUR.asn1.x509.SubjectPublicKeyInfo();
  info.setRSAPEM(string);
  this.setPublic(info.rsaKey.n, info.rsaKey.e);
};
