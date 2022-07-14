'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _stripAnsi = require('strip-ansi');
var _hasAnsi = require('has-ansi');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _stripAnsi__default = /*#__PURE__*/_interopDefaultLegacy(_stripAnsi);
var _hasAnsi__default = /*#__PURE__*/_interopDefaultLegacy(_hasAnsi);

function stripAnsiValue(input, toStr) {
  if (!input) {
    return input;
  }

  let isBuffer = typeof input !== 'string';
  let output = input.toString();
  output = _stripAnsi__default["default"](output);

  if (isBuffer && !toStr) {
    if (_hasAnsi__default["default"](output)) {
      return Buffer.from(output);
    }

    return input;
  }

  return output;
}

exports["default"] = stripAnsiValue;
exports.stripAnsiValue = stripAnsiValue;
//# sourceMappingURL=index.cjs.development.cjs.map
