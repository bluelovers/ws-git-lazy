"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._callSplit = exports._cmdSplit = exports.unparseCmdSplit = exports.handleOptionsSplit = exports.handleValueSplit = exports.assertValueSplit = void 0;
const tslib_1 = require("tslib");
const core_1 = require("../core");
const spawn_1 = (0, tslib_1.__importDefault)(require("@git-lazy/spawn"));
function assertValueSplit(optionsRuntime) {
    //assertString(optionsRuntime.branch, 'branch');
}
exports.assertValueSplit = assertValueSplit;
function handleValueSplit(options) {
    return options;
}
exports.handleValueSplit = handleValueSplit;
function handleOptionsSplit(options) {
    var _a;
    let handlers = (_a = options.handlers) !== null && _a !== void 0 ? _a : {};
    return (0, core_1.handleOptions)({
        ...options,
        handlers: {
            ...handlers,
            assertValue: handlers.assertValue || assertValueSplit,
            handleValue: handlers.handleValue || handleValueSplit,
        }
    });
}
exports.handleOptionsSplit = handleOptionsSplit;
function unparseCmdSplit(cmd, opts) {
    return [
        'subtree',
        cmd,
        ...(opts.branch ? ['-b', opts.branch] : []),
        '--prefix',
        opts.prefixPath,
        ...(opts.options.rejoin ? ['--rejoin'] : []),
        ...(opts.options.ignoreJoins ? ['--ignore-joins'] : []),
    ];
}
exports.unparseCmdSplit = unparseCmdSplit;
function _cmdSplit(cmd, opts) {
    return (0, spawn_1.default)('git', unparseCmdSplit(cmd, opts), {
        cwd: opts.root,
        stdio: 'inherit',
    });
}
exports._cmdSplit = _cmdSplit;
function _callSplit(cmd, options) {
    let opts = handleOptionsSplit(options);
    return _cmdSplit(cmd, opts);
}
exports._callSplit = _callSplit;
//# sourceMappingURL=split.js.map