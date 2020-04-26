(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Double = {}));
}(this, (function (exports) { 'use strict';

  function wtf(a, b) {
      return a + b;
  }

  exports.wtf = wtf;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
