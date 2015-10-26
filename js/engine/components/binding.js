/**
 * Inspired by THREEx windowresize
 */

(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.binding = {};

  ENGINE.binding.bind = function(element)
  {
    ENGINE.binding.element = $(element);
  };

  ENGINE.binding.bindRenderer = function(renderer, camera)
  {
    ENGINE.binding.element.resize(function()
    {
      adjust(renderer, camera, ENGINE.binding.element);
    });

    $(window).resize(function()
    {
      adjust(renderer, camera, ENGINE.binding.element);
    });

    ENGINE.binding.element.append(renderer.domElement);
    ENGINE.binding.element.resize();

    ENGINE.stats.bind(ENGINE.binding.element);

    ENGINE.controls.pointer.lock(renderer.domElement);
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function adjust(renderer, camera, element)
  {
    var width = element.innerWidth(),
      height = element.innerHeight();

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
})();
