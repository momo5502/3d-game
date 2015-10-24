/**
 * Inspired by THREEx windowresize
 */

(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.binding = {};

  ENGINE.bind = function(renderer, camera, element)
  {
    element = $(element);

    ENGINE.binding.element = element;

    element.resize(function()
    {
      adjust(renderer, camera, element);
    });

    $(window).resize(function()
    {
      adjust(renderer, camera, element);
    });

    element.append(renderer.domElement);
    element.resize();

    ENGINE.stats.bind(element);

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
