"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCloneSubDir = void 0;
const clone_1 = require("@git-lazy/clone");
const subtree_1 = require("@git-lazy/subtree");
const util_1 = require("@git-lazy/clone/lib/util");
const debug_1 = require("@git-lazy/debug");
const spawn_1 = require("@git-lazy/spawn");
const root_1 = require("@git-lazy/root");
const branch_exists_1 = require("@git-lazy/branch/lib/branch-exists");
const current_name_1 = require("@git-lazy/branch/lib/current-name");
const assert_1 = require("assert");
async function gitCloneSubDir(remote, options) {
    var _a, _b;
    ({ remote, options } = (0, util_1.handleOptions)(remote, options));
    debug_1.console.info(`clone remote:`, remote);
    await (0, clone_1.gitClone)(remote, options);
    let cwd = options.targetDir;
    if (!(0, root_1.isGitRoot)(cwd)) {
        throw new Error(`${options.targetDir} not a git root`);
    }
    const _defaultBranch = (0, current_name_1.currentBranchName)(cwd);
    const defaultBranch = (_a = options.defaultSourceBranch) !== null && _a !== void 0 ? _a : _defaultBranch;
    if (_defaultBranch !== defaultBranch) {
        await (0, spawn_1.crossSpawnGitAsync)('git', [
            'checkout',
            '-B',
            defaultBranch
        ], {
            cwd,
            stdio: 'inherit',
        });
        _assertCurrentBranchName(defaultBranch, cwd);
    }
    debug_1.console.info(`defaultBranch:`, defaultBranch);
    let branch = 'temp/' + Date.now().toString();
    await (0, subtree_1.subtreeSplit)({
        cwd,
        prefix: options.subDir,
        branch,
    });
    let branch2 = (0, branch_exists_1._localBranchExists)(branch, cwd);
    if (!(branch2 === null || branch2 === void 0 ? void 0 : branch2.length)) {
        throw new Error(`branch '${branch}' not exists, current branch is ${(0, current_name_1.currentBranchName)(cwd)}`);
    }
    const _tempBranch = `${branch}-master`;
    await (0, spawn_1.crossSpawnGitAsync)('git', [
        'checkout',
        '-B',
        _tempBranch,
        branch2
    ], {
        cwd,
        stdio: 'inherit',
    });
    const branch3 = (0, current_name_1.currentBranchName)(cwd);
    if (_tempBranch !== branch3) {
        throw new Error(`something wrong when checkout branch ${_tempBranch}, current branch is ${branch3}`);
    }
    const newBranch = (_b = options.newBranch) !== null && _b !== void 0 ? _b : defaultBranch;
    await (0, spawn_1.crossSpawnGitAsync)('git', [
        'checkout',
        '-B',
        newBranch,
        _tempBranch,
    ], {
        cwd,
        stdio: 'inherit',
    });
    _assertCurrentBranchName(newBranch, cwd);
}
exports.gitCloneSubDir = gitCloneSubDir;
function _assertCurrentBranchName(name, cwd, message) {
    const _branch = (0, current_name_1.currentBranchName)(cwd);
    (0, assert_1.deepStrictEqual)(_branch, name, message);
}
exports.default = gitCloneSubDir;
//# sourceMappingURL=index.js.map