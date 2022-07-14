import { crlf as r } from "crlf-normalize";

import { stripAnsiValue as t } from "@lazy-spawn/strip-ansi";

function crossSpawnOutput(n, o = {
  clearEol: !0
}) {
  let a = "";
  return a = !Buffer.isBuffer(n) && Array.isArray(n) ? n.filter((function(r) {
    return !(!r || !r.length);
  })).map((function(r) {
    return r.toString();
  })).join("\n") : (n || "").toString(), o.stripAnsi && (a = t(a)), a = r(a), (o.clearEol || null == o.clearEol) && (a = a.replace(/\n+$/g, "")), 
  a;
}

export { crossSpawnOutput, crossSpawnOutput as default };
//# sourceMappingURL=index.esm.mjs.map
