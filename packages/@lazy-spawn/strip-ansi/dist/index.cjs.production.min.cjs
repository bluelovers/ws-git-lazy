"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("strip-ansi"), r = require("has-ansi");

function stripAnsiValue(t, i) {
  if (!t) return t;
  let s = "string" != typeof t, u = t.toString();
  return u = e(u), s && !i ? r(u) ? Buffer.from(u) : t : u;
}

exports.default = stripAnsiValue, exports.stripAnsiValue = stripAnsiValue;
//# sourceMappingURL=index.cjs.production.min.cjs.map
