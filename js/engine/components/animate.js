(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  var maxFps = new ENGINE.dvar("com_maxfps", 0);

  /**
   * Provides requestAnimationFrame in a cross browser way.
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */
  if (!window.requestAnimationFrame)
  {
    window.requestAnimationFrame = (function()
    {
      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element)
        {
          window.setTimeout(callback, 1000 / 60);
        };
    })();
  }

  ENGINE.animate = function(callback)
  {
    lockFrames(maxFps.get());

    window.requestAnimationFrame(function(e)
    {
      ENGINE.animate(callback);
    });

    ENGINE.stats.update();
    callback();
  };

  ENGINE.hasWebGL = (function()
  {
    try
    {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    }
    catch (e)
    {
      return false;
    }
  })();

  var time = 0;

  function lockFrames(frames)
  {
    if (frames == 0) return;

    if (time != 0)
    {
      var start = Date.now();
      var delta = start - time;
      var remainingTime = (1000 / frames) - delta;

      while ((Date.now() - start) < remainingTime);
    }

    time = Date.now();
  }
})();
