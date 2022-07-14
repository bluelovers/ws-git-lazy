'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crlfNormalize = require('crlf-normalize');
var stripAnsi = require('@lazy-spawn/strip-ansi');

function crossSpawnOutput(buf, options = {
  clearEol: true
}) {
  let output = '';

  if (!Buffer.isBuffer(buf) && Array.isArray(buf)) {
    output = buf.filter(function (b) {
      return !(!b || !b.length);
    }).map(function (b) {
      return b.toString();
    }).join("\n");
  } else {
    output = (buf || '').toString();
  }

  if (options.stripAnsi) {
    output = stripAnsi.stripAnsiValue(output);
  }

  output = crlfNormalize.crlf(output);

  if (options.clearEol || options.clearEol == null) {
    output = output.replace(/\n+$/g, '');
  }

  return output;
}

exports.crossSpawnOutput = crossSpawnOutput;
exports["default"] = crossSpawnOutput;
//# sourceMappingURL=index.cjs.development.cjs.map
