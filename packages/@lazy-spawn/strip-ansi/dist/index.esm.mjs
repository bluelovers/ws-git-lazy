import r from "strip-ansi";

import t from "has-ansi";

function stripAnsiValue(i, s) {
  if (!i) return i;
  let n = "string" != typeof i, e = i.toString();
  return e = r(e), n && !s ? t(e) ? Buffer.from(e) : i : e;
}

export { stripAnsiValue as default, stripAnsiValue };
//# sourceMappingURL=index.esm.mjs.map
