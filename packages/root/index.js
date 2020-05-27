"use strict";
/**
 * Created by user on 2019/6/13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitRoot = exports.hasGit = exports.gitRoot = void 0;
const git_root2_1 = __importDefault(require("git-root2"));
exports.gitRoot = git_root2_1.default;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function hasGit(cwd) {
    if (!cwd || typeof cwd !== 'string' || !git_root2_1.default(cwd)) {
        throw new TypeError(`'${cwd}' is not exists in git`);
    }
    return cwd;
}
exports.hasGit = hasGit;
function isGitRoot(cwd, realpath) {
    let p1 = path_1.default.normalize(cwd);
    let p2 = path_1.default.normalize(git_root2_1.default(cwd));
    if (realpath) {
        return (fs_1.default.realpathSync(p1) === fs_1.default.realpathSync(p2));
    }
    return (p1 === p2);
}
exports.isGitRoot = isGitRoot;
exports.default = git_root2_1.default;
//# sourceMappingURL=index.js.map