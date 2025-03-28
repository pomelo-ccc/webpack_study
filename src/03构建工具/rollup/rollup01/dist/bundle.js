
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var MyLibrary = (function (exports) {
  'use strict';

  console.log('utils.js被加载了');

  function add(a, b) {
      console.log(`[Logger]: ${a}`);
      console.log(`[Logger]: ${b}`);
    return a + b;
  }

  function multiply(a, b) {
    return a * b;
  }

  function subtract(a, b) {
    return a - b;
  }

  console.log('数学库定5'); // 主入口文件

  exports.add = add;
  exports.multiply = multiply;
  exports.subtract = subtract;

  return exports;

})({});
//# sourceMappingURL=bundle.js.map
