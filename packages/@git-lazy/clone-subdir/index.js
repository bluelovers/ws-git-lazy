"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCloneSubDir = void 0;
const tslib_1 = require("tslib");
const clone_1 = require("@git-lazy/clone");
const subtree_1 = require("@git-lazy/subtree");
const util_1 = require("@git-lazy/clone/lib/util");
const spawn_1 = tslib_1.__importDefault(require("@git-lazy/spawn"));
const root_1 = require("@git-lazy/root");
const branch_exists_1 = tslib_1.__importDefault(require("@git-lazy/branch/lib/branch-exists"));
const current_name_1 = tslib_1.__importDefault(require("@git-lazy/branch/lib/current-name"));
async function gitCloneSubDir(remote, options) {
    ({ remote, options } = (0, util_1.handleOptions)(remote, options));
    await (0, clone_1.gitClone)(remote, options);
    let branch = Date.now().toString();
    let cwd = options.targetDir;
    if (!(0, root_1.isGitRoot)(cwd)) {
        throw new Error(`${options.targetDir} not a git root`);
    }
    await (0, subtree_1.subtreeSplit)({
        cwd,
        prefix: options.subDir,
        branch,
    });
    if (!(0, branch_exists_1.default)(branch, cwd)) {
        throw new Error(`branch '${branch}' not exists`);
    }
    await (0, spawn_1.default)('git', [
        'checkout',
        '-B',
        `master`,
        branch
    ], {
        cwd,
        stdio: 'inherit',
    });
    if (branch !== (0, current_name_1.default)(cwd)) {
        throw new Error(`something wrong when switch branch {${branch} => master}`);
    }
}
exports.gitCloneSubDir = gitCloneSubDir;
exports.default = gitCloneSubDir;
//# sourceMappingURL=index.js.map