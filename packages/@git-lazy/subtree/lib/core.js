"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._call = exports._cmd = exports.unparseCmd = exports.handleOptions = void 0;
const util_1 = require("./util");
const spawn_1 = __importDefault(require("@git-lazy/spawn"));
const git_1 = require("./util/git");
function handleOptions(options) {
    var _a, _b, _c, _d, _e, _f;
    let { cwd, root } = git_1.handleGitPath(options);
    let { prefix, prefixType } = util_1.handlePrefix(options.prefix);
    let { prefixPath } = ((_b = (_a = options.handlers) === null || _a === void 0 ? void 0 : _a.handlePrefixPath) !== null && _b !== void 0 ? _b : util_1.handlePrefixPath)({
        prefix,
        prefixType,
        root,
        cwd,
    });
    let options2 = {
        ...options,
    };
    if ((_c = options.handlers) === null || _c === void 0 ? void 0 : _c.handleValue) {
        options = options.handlers.handleValue(options2);
    }
    else {
        options2.branch = (_d = options2.branch) !== null && _d !== void 0 ? _d : 'master';
        options2.remote = (_e = options2.remote) !== null && _e !== void 0 ? _e : options2.name;
    }
    let { remote, branch, } = options2;
    let data = {
        options,
        cwd,
        root,
        remote,
        branch,
        prefixType,
        prefix,
        prefixPath,
    };
    if ((_f = options.handlers) === null || _f === void 0 ? void 0 : _f.assertValue) {
        options.handlers.assertValue(data);
    }
    else {
        util_1.assertString(data.remote, 'remote');
        util_1.assertString(data.branch, 'branch');
    }
    util_1.assertString(data.root, 'root');
    util_1.assertString(data.prefixPath, 'prefix');
    return data;
}
exports.handleOptions = handleOptions;
function unparseCmd(cmd, opts) {
    return [
        'subtree',
        cmd,
        opts.remote,
        '-b',
        opts.branch,
        '--prefix',
        opts.prefixPath,
        ...(opts.options.squash ? ['--squash'] : []),
    ];
}
exports.unparseCmd = unparseCmd;
function _cmd(cmd, opts) {
    return spawn_1.default('git', unparseCmd(cmd, opts), {
        cwd: opts.root,
        stdio: 'inherit',
    });
}
exports._cmd = _cmd;
function _call(cmd, options) {
    let opts = handleOptions(options);
    return _cmd(cmd, opts);
}
exports._call = _call;
//# sourceMappingURL=core.js.map