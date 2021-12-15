"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitUntrackedDir = exports.gitUntrackedFile = void 0;
const tslib_1 = require("tslib");
const git_1 = require("@git-lazy/util/spawn/git");
const sort_tree_1 = require("@lazy-glob/sort-tree");
const array_hyper_unique_1 = require("array-hyper-unique");
const data_1 = require("@git-lazy/util/spawn/data");
const root_1 = require("@git-lazy/root");
const path_1 = tslib_1.__importDefault(require("path"));
function gitUntrackedFile(git_root, options) {
    git_root = (0, root_1.hasGit)(git_root);
    const { bin = 'git' } = (options || {});
    let cp = (0, git_1.crossSpawnSync)(bin, 'ls-files --others --exclude-standard'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return (0, data_1.handleSpawnOutputArray)(cp.stdout.toString());
}
exports.gitUntrackedFile = gitUntrackedFile;
function gitUntrackedDir(git_root, options) {
    return (0, sort_tree_1.sortTree)((0, array_hyper_unique_1.array_unique)(gitUntrackedFile(git_root, options)
        .map(v => path_1.default.dirname(v))));
}
exports.gitUntrackedDir = gitUntrackedDir;
exports.default = gitUntrackedFile;
//# sourceMappingURL=index.js.map