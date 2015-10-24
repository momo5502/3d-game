(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.stats = {};

  ENGINE.stats.object = new Stats();
  ENGINE.stats.object.setMode(0);
  ENGINE.stats.object.domElement.style.position = 'fixed';
  ENGINE.stats.object.domElement.style.right = '0px';
  ENGINE.stats.object.domElement.style.top = '0px';
  ENGINE.stats.object.domElement.style.display = 'none';

  ENGINE.stats.update = function()
  {
    ENGINE.stats.object.update();
  };

  ENGINE.stats.bind = function(element)
  {
    element.append(ENGINE.stats.object.domElement);
  };

  ENGINE.stats.display = function()
  {
    ENGINE.stats.object.domElement.style.display = 'inline';
  };

})();
