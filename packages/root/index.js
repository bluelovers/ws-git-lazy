"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitRoot = exports.hasGit = exports.gitRoot = void 0;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("git-root2/core"));
exports.gitRoot = core_1.default;
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
function hasGit(cwd) {
    if (!cwd || typeof cwd !== 'string' || !(0, core_1.default)(cwd)) {
        throw new TypeError(`'${cwd}' is not exists in git`);
    }
    return cwd;
}
exports.hasGit = hasGit;
function isGitRoot(cwd, realpath) {
    let p1 = path_1.default.normalize(cwd);
    let p2 = path_1.default.normalize((0, core_1.default)(cwd));
    if (realpath) {
        return (fs_1.default.realpathSync(p1) === fs_1.default.realpathSync(p2));
    }
    return (p1 === p2);
}
exports.isGitRoot = isGitRoot;
exports.default = core_1.default;
//# sourceMappingURL=index.js.map