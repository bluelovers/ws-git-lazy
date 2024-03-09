'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var readlines = require('@lazy-node/readlines');

const re = /^(\w+)\s(\w+)\s(.*)$/;
function isRebaseCommentLineString(line) {
  return /^(?:\s*)(?:#.*)?$/.test(line);
}
function isRebaseCommentLine(line) {
  return line.type === 0 /* EnumRebaseLineType.COMMENT */;
}
function isRebaseCommandLine(line) {
  return line.type === 1 /* EnumRebaseLineType.COMMAND */;
}
function filterRebaseListByType(lines, type) {
  // @ts-ignore
  return lines.filter(line => line.type === type);
}

exports.EnumRebaseLineType = void 0;
(function (EnumRebaseLineType) {
  EnumRebaseLineType[EnumRebaseLineType["COMMENT"] = 0] = "COMMENT";
  EnumRebaseLineType[EnumRebaseLineType["COMMAND"] = 1] = "COMMAND";
})(exports.EnumRebaseLineType || (exports.EnumRebaseLineType = {}));
exports.EnumRebaseCommands = void 0;
(function (EnumRebaseCommands) {
  EnumRebaseCommands["pick"] = "pick";
  EnumRebaseCommands["reword"] = "reword";
  EnumRebaseCommands["edit"] = "edit";
  EnumRebaseCommands["squash"] = "squash";
  EnumRebaseCommands["fixup"] = "fixup";
  EnumRebaseCommands["exec"] = "exec";
})(exports.EnumRebaseCommands || (exports.EnumRebaseCommands = {}));
function toRebaseCommand(cmd) {
  // @ts-ignore
  return exports.EnumRebaseCommands[cmd];
}

function validRebaseCommand(cmd) {
  var _toRebaseCommand;
  return ((_toRebaseCommand = toRebaseCommand(cmd)) === null || _toRebaseCommand === void 0 ? void 0 : _toRebaseCommand.length) > 0;
}
function assertRebaseCommand(cmd) {
  if (!validRebaseCommand(cmd)) {
    throw new RangeError(`${cmd} is not valid rebase command`);
  }
}

function parseRebaseCommandLine(raw) {
  const m = re.exec(raw);
  const [, cmd, hash, message] = m;
  assertRebaseCommand(cmd);
  return {
    raw,
    cmd: cmd,
    hash,
    message
  };
}
function parseRebaseLine(raw) {
  if (isRebaseCommentLineString(raw)) {
    return {
      type: 0 /* EnumRebaseLineType.COMMENT */,
      raw
    };
  }
  return {
    type: 1 /* EnumRebaseLineType.COMMAND */,
    ...parseRebaseCommandLine(raw)
  };
}
function generatorParseRebaseTodoFromBuffer(context) {
  const liner = new readlines.LineByLine(context);
  return generatorParseRebaseTodoFromIterable(liner.generator());
}
function* generatorParseRebaseTodoFromIterable(iterator) {
  for (let line of iterator) {
    yield parseRebaseLine(line.toString());
  }
}
function generatorParseRebaseTodoFromArray(lines) {
  if (!Array.isArray(lines)) {
    throw new TypeError(`lines must be an array`);
  }
  return generatorParseRebaseTodoFromIterable(lines);
}
function parseRebaseTodo(context) {
  return [...(Array.isArray(context) ? generatorParseRebaseTodoFromArray : generatorParseRebaseTodoFromBuffer)(context)];
}

exports.assertRebaseCommand = assertRebaseCommand;
exports.default = parseRebaseTodo;
exports.filterRebaseListByType = filterRebaseListByType;
exports.generatorParseRebaseTodoFromArray = generatorParseRebaseTodoFromArray;
exports.generatorParseRebaseTodoFromBuffer = generatorParseRebaseTodoFromBuffer;
exports.generatorParseRebaseTodoFromIterable = generatorParseRebaseTodoFromIterable;
exports.isRebaseCommandLine = isRebaseCommandLine;
exports.isRebaseCommentLine = isRebaseCommentLine;
exports.isRebaseCommentLineString = isRebaseCommentLineString;
exports.parseRebaseCommandLine = parseRebaseCommandLine;
exports.parseRebaseLine = parseRebaseLine;
exports.parseRebaseTodo = parseRebaseTodo;
exports.re = re;
exports.toRebaseCommand = toRebaseCommand;
exports.validRebaseCommand = validRebaseCommand;
//# sourceMappingURL=index.cjs.development.cjs.map
