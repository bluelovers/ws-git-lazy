"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValueSplit = assertValueSplit;
exports.handleValueSplit = handleValueSplit;
exports.handleOptionsSplit = handleOptionsSplit;
exports.unparseCmdSplit = unparseCmdSplit;
exports._cmdSplit = _cmdSplit;
exports._callSplit = _callSplit;
const core_1 = require("../core");
const spawn_1 = require("@git-lazy/spawn");
function assertValueSplit(optionsRuntime) {
    //assertString(optionsRuntime.branch, 'branch');
}
function handleValueSplit(options) {
    return options;
}
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
function _cmdSplit(cmd, opts) {
    return (0, spawn_1.crossSpawnGitAsync)('git', unparseCmdSplit(cmd, opts), {
        cwd: opts.root,
        stdio: 'inherit',
    });
}
function _callSplit(cmd, options) {
    let opts = handleOptionsSplit(options);
    return _cmdSplit(cmd, opts);
}
//# sourceMappingURL=split.js.map