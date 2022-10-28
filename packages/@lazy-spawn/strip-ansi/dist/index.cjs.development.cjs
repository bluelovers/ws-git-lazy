'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _stripAnsi = require('strip-ansi');
var _hasAnsi = require('has-ansi');

function stripAnsiValue(input, toStr) {
  if (!input) {
    return input;
  }
  let isBuffer = typeof input !== 'string';
  let output = input.toString();
  output = _stripAnsi(output);
  if (isBuffer && !toStr) {
    if (_hasAnsi(output)) {
      return Buffer.from(output);
    }
    return input;
  }
  return output;
}

exports.default = stripAnsiValue;
exports.stripAnsiValue = stripAnsiValue;
//# sourceMappingURL=index.cjs.development.cjs.map
