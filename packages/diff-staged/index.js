"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitDiffStagedFile = exports.gitDiffStagedDir = exports.gitDiffStaged = void 0;
const tslib_1 = require("tslib");
const root_1 = require("@git-lazy/root");
const spawn_1 = require("@git-lazy/spawn");
const data_1 = (0, tslib_1.__importDefault)(require("@git-lazy/spawn/lib/data"));
function gitDiffStaged(git_root, options) {
    git_root = (0, root_1.hasGit)(git_root);
    const { bin = 'git' } = (options || {});
    let cp = (0, spawn_1.crossSpawnGitSync)(bin, 'diff --cached --name-only'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return (0, data_1.default)(cp.stdout.toString());
}
exports.gitDiffStaged = gitDiffStaged;
function gitDiffStagedDir(git_root, options) {
    git_root = (0, root_1.hasGit)(git_root);
    const { bin = 'git' } = (options || {});
    let cp = (0, spawn_1.crossSpawnGitSync)(bin, 'diff --cached --dirstat=files,0 --no-color'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = (0, spawn_1.crossSpawnGitSync)(bin, 'diff --dirstat=files,0 --no-color'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return (0, data_1.default)([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'), s => {
        return s.replace(/^\s+\d+(\.\d+)%\s+/, '');
    });
}
exports.gitDiffStagedDir = gitDiffStagedDir;
function gitDiffStagedFile(git_root, options) {
    git_root = (0, root_1.hasGit)(git_root);
    const { bin = 'git' } = (options || {});
    let cp = (0, spawn_1.crossSpawnGitSync)(bin, 'diff --cached --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    let cp2 = (0, spawn_1.crossSpawnGitSync)(bin, 'diff --name-only --relative'.split(' '), {
        cwd: git_root,
        stripAnsi: true,
    });
    return (0, data_1.default)([
        cp.stdout.toString(),
        cp2.stdout.toString(),
    ].join('\n'));
}
exports.gitDiffStagedFile = gitDiffStagedFile;
exports.default = gitDiffStagedFile;
//# sourceMappingURL=index.js.map