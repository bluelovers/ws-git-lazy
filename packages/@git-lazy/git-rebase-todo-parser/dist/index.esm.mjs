import { LineByLine as e } from "@lazy-node/readlines";

const r = /^(\w+)\s(\w+)\s(.*)$/;

function isRebaseCommentLineString(e) {
  return /^(?:\s*)(?:#.*)?$/.test(e);
}

function isRebaseCommentLine(e) {
  return 0 === e.type;
}

function isRebaseCommandLine(e) {
  return 1 === e.type;
}

function filterRebaseListByType(e, r) {
  return e.filter((e => e.type === r));
}

var a, o;

function toRebaseCommand(e) {
  return o[e];
}

function validRebaseCommand(e) {
  var r;
  return (null === (r = toRebaseCommand(e)) || void 0 === r ? void 0 : r.length) > 0;
}

function assertRebaseCommand(e) {
  if (!validRebaseCommand(e)) throw new RangeError(`${e} is not valid rebase command`);
}

function parseRebaseCommandLine(e) {
  const a = r.exec(e), [, o, n, s] = a;
  return assertRebaseCommand(o), {
    raw: e,
    cmd: o,
    hash: n,
    message: s
  };
}

function parseRebaseLine(e) {
  return isRebaseCommentLineString(e) ? {
    type: 0,
    raw: e
  } : {
    type: 1,
    ...parseRebaseCommandLine(e)
  };
}

function generatorParseRebaseTodoFromBuffer(r) {
  return generatorParseRebaseTodoFromIterable(new e(r).generator());
}

function* generatorParseRebaseTodoFromIterable(e) {
  for (let r of e) yield parseRebaseLine(r.toString());
}

function generatorParseRebaseTodoFromArray(e) {
  if (!Array.isArray(e)) throw new TypeError("lines must be an array");
  return generatorParseRebaseTodoFromIterable(e);
}

function parseRebaseTodo(e) {
  return [ ...(Array.isArray(e) ? generatorParseRebaseTodoFromArray : generatorParseRebaseTodoFromBuffer)(e) ];
}

!function(e) {
  e[e.COMMENT = 0] = "COMMENT", e[e.COMMAND = 1] = "COMMAND";
}(a || (a = {})), function(e) {
  e.pick = "pick", e.reword = "reword", e.edit = "edit", e.squash = "squash", e.fixup = "fixup", 
  e.exec = "exec";
}(o || (o = {}));

export { o as EnumRebaseCommands, a as EnumRebaseLineType, assertRebaseCommand, parseRebaseTodo as default, filterRebaseListByType, generatorParseRebaseTodoFromArray, generatorParseRebaseTodoFromBuffer, generatorParseRebaseTodoFromIterable, isRebaseCommandLine, isRebaseCommentLine, isRebaseCommentLineString, parseRebaseCommandLine, parseRebaseLine, parseRebaseTodo, r as re, toRebaseCommand, validRebaseCommand };
//# sourceMappingURL=index.esm.mjs.map
