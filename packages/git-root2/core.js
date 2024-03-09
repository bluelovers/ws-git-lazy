"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitRoot = gitRoot;
exports.isGitRoot = isGitRoot;
exports.sync = sync;
exports.async = async;
const upath2_1 = require("upath2");
const fs_1 = require("fs");
const spawn_1 = require("@git-lazy/spawn");
const stringify_1 = require("@lazy-spawn/stringify");
const path_is_same_1 = require("path-is-same");
function gitRoot(cwd) {
    let p = (0, stringify_1.crossSpawnOutput)(((0, spawn_1.crossSpawnGitSync)('git', [
        'rev-parse',
        '--show-toplevel',
    ], {
        cwd,
        stripAnsi: true,
    }).stdout || ''), {
        stripAnsi: true,
        clearEol: true,
    }).replace(/^[\n\r]+|[\n\r]+$/g, '');
    if (p) {
        p = (0, upath2_1.resolve)(p);
        if ((0, fs_1.existsSync)(p)) {
            return p;
        }
    }
    return null;
}
function isGitRoot(target) {
    return (0, path_is_same_1.pathIsSame)(target, gitRoot(target));
}
function sync(cwd) {
    return gitRoot(cwd);
}
// lazy fake async
async function async(cwd) {
    return gitRoot(cwd);
}
gitRoot.isGitRoot = isGitRoot;
gitRoot.sync = sync;
gitRoot.async = async;
gitRoot.default = gitRoot;
exports.default = gitRoot;
//# sourceMappingURL=core.js.map