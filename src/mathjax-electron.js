"use strict";

var path = require('path');

/**
 * Loads and configures MathJax if necessary.
 * @param  {Document} document - A Document Object Model.
 * The MathJax Script is included in the <head> section of the HTML document.
 * @param  {Callback} callback - A callback to run when MathJax is loaded.
 */
var loadMathJax = function(document, callback) {
  callback = (typeof callback === 'function') ? callback : function() {};
  if (typeof MathJax === "undefined" || MathJax === null) {
    var script = document.createElement("script");

    script.addEventListener("load", function() {
      configureMathJax();
      callback();
    });
    script.type = "text/javascript";

    try {
      script.src = path.join(__dirname, "..", "resources", "MathJax",
      "MathJax.js?delayStartupUntil=configured");

      document.getElementsByTagName("head")[0].appendChild(script);
    } catch (error) {
      throw new Error(error.message, "loadMathJax");
    }
  } else {
    callback();
  }
};

/**
 * Typesets any math elements within the element.
 * @param  {HTMLElement}  container - The element whose math is to be typeset.
 * @param  {Callback}     callback  - A callback to run when the typeset
 * is complete.
 */
var typesetMath = function(container, callback) {
  callback = (typeof callback === 'function') ? callback : function() {};
  try {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, container], callback);
  } catch (error) {
    throw new Error(error.message, "typesetMath");
  }
};

/**
 * A helper function which loads MathJax if necessary and typesets any math
 * elements within the container.
 * @param  {Document}     document  - A Document Object Model.
 * The MathJax Script is included in the <head> section of the HTML document.
 * @param  {HTMLElement}  container - The element whose math is to be typeset.
 * @param  {Callback}     callback  - A callback to run when the typeset
 * is complete.
 */
var mathProcessor = function(document, container, callback) {
  loadMathJax(document, function() {
    typesetMath(container, callback);
  });
};


var configureMathJax = function() {
  MathJax.Hub.Config({
    jax: ["input/TeX", "output/SVG"],
    extensions: ["tex2jax.js"],
    messageStyle: "none",
    showMathMenu: false,
    tex2jax: {
      inlineMath: [
        ['$', '$'],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ['$$', '$$'],
        ["\\[", "\\]"]
      ],
      processEscapes: true,
      processEnvironments: true,
      preview: "none"
    },
    TeX: {
      extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
    },
    SVG: {
      font: "STIX-Web"
    }
  });
  MathJax.Hub.Configured();
};

module.exports = {
  loadMathJax,
  typesetMath,
  mathProcessor
}
