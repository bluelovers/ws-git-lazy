"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.sync = exports.isGitRoot = exports.gitRoot = void 0;
const util_1 = require("@git-lazy/spawn/lib/util");
const upath2_1 = require("upath2");
const fs_1 = require("fs");
const spawn_1 = require("@git-lazy/spawn");
function gitRoot(cwd) {
    let p = util_1.crossSpawnOutput((spawn_1.crossSpawnGitSync('git', [
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
        p = upath2_1.resolve(p);
        if (fs_1.existsSync(p)) {
            return p;
        }
    }
    return null;
}
exports.gitRoot = gitRoot;
function isGitRoot(target) {
    let root = gitRoot(target);
    return (root && upath2_1.resolve(root) === upath2_1.resolve(target));
}
exports.isGitRoot = isGitRoot;
function sync(cwd) {
    return gitRoot(cwd);
}
exports.sync = sync;
// lazy fake async
async function async(cwd) {
    return gitRoot(cwd);
}
exports.async = async;
gitRoot.isGitRoot = isGitRoot;
gitRoot.sync = sync;
gitRoot.async = async;
gitRoot.default = gitRoot;
exports.default = gitRoot;
//# sourceMappingURL=core.js.map