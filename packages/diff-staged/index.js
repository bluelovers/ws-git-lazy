"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitDiffStagedFile = exports.gitDiffStagedDir = exports.gitDiffStaged = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const data_1 = require("@git-lazy/util/spawn/data");
const root_1 = require("@git-lazy/root");
function gitDiffStaged(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray(cp.stdout.toString());
}
exports.gitDiffStaged = gitDiffStaged;
function gitDiffStagedDir(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --dirstat=files,0'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'), s => {
        return s.replace(/^\s+\d+(\.\d+)%\s+/, '');
    });
}
exports.gitDiffStagedDir = gitDiffStagedDir;
function gitDiffStagedFile(git_root, options) {
    git_root = root_1.hasGit(git_root);
    const { bin = 'git' } = (options || {});
    let cp = git_1.crossSpawnSync(bin, 'diff --cached --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = git_1.crossSpawnSync(bin, 'diff --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return data_1.handleSpawnOutputArray([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'));
}
exports.gitDiffStagedFile = gitDiffStagedFile;
exports.default = gitDiffStagedFile;
//# sourceMappingURL=index.js.map