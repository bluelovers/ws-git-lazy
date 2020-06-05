"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._call = exports._cmd = exports.handleOptions = void 0;
const types_1 = require("./types");
const upath2_1 = require("upath2");
const git_root2_1 = __importDefault(require("git-root2"));
const util_1 = require("./util");
const spawn_1 = __importDefault(require("@git-lazy/spawn"));
function handleOptions(options) {
    var _a, _b, _c;
    let cwd = upath2_1.resolve((_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd());
    let root = upath2_1.normalize(git_root2_1.default(cwd));
    let { prefix, prefixType } = util_1.handlePrefix(options.prefix);
    let prefixPath = prefix;
    if (prefixType !== types_1.EnumPrefixType.ROOT) {
        prefixPath = upath2_1.resolve(cwd, prefix);
        if (util_1.inSubPath(prefixPath, root)) {
            prefixPath = upath2_1.relative(root, prefixPath);
        }
        else {
            throw new Error(`prefix path is not allow: ${prefixPath}`);
        }
    }
    let branch = (_b = options.branch) !== null && _b !== void 0 ? _b : 'master';
    let remote = (_c = options.remote) !== null && _c !== void 0 ? _c : options.name;
    if (typeof remote !== 'string' || !remote.length) {
        throw new TypeError(`remote is not valid: ${remote}`);
    }
    if (typeof branch !== 'string' || !branch.length) {
        throw new TypeError(`branch is not valid: ${branch}`);
    }
    return {
        options,
        cwd,
        root,
        remote,
        branch,
        prefixType,
        prefix,
        prefixPath,
    };
}
exports.handleOptions = handleOptions;
function _cmd(cmd, opts) {
    return spawn_1.default('git', [
        'subtree',
        cmd,
        opts.remote,
        opts.branch,
        '--prefix',
        opts.prefixPath,
        ...(opts.options.squash ? ['--squash'] : []),
    ], {
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