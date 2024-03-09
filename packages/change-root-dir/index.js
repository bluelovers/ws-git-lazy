"use strict";
/**
 * Created by user on 2019/7/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitChangeRootDir = gitChangeRootDir;
exports._core = _core;
const git_1 = require("@git-lazy/util/spawn/git");
const root_1 = require("@git-lazy/root");
const fast_glob_1 = require("@bluelovers/fast-glob");
const stringify_1 = require("@lazy-spawn/stringify");
/**
 * https://stackoverflow.com/a/11764065/4563339
 */
function gitChangeRootDir(options) {
    const { bin = 'git', cwd, yesDoIt, force, stdio = 'inherit' } = options;
    if (!(0, root_1.isGitRoot)(cwd)) {
        throw new RangeError(`cwd not a git root ${cwd}`);
    }
    if (!yesDoIt) {
        const msg = `options.yesDoIt must be true, this is unsafe action, make sure u backup all data`;
        throw new Error(msg);
    }
    let { targetPath } = options;
    let ls = (0, fast_glob_1.sync)([
        targetPath,
        '!**/.git',
    ], {
        cwd,
        onlyFiles: false,
        onlyDirectories: true,
    });
    if (ls.length != 1) {
        throw new RangeError(`targetPath is not allow, [${ls}], length: ${ls.length}`);
    }
    return targetPath
        .split('/')
        .map((targetPath) => {
        console.debug(`current: ${targetPath}`);
        return _core({
            bin,
            cwd,
            targetPath,
            force,
            stdio,
        });
    });
}
function _core(options) {
    const { bin = 'git', cwd, targetPath, force, stdio = 'inherit' } = options;
    if (typeof targetPath !== 'string' || targetPath === '') {
        throw new RangeError(`targetPath is not allow, '${targetPath}'`);
    }
    let cp = (0, git_1.crossSpawnSync)(bin, [
        'filter-branch',
        '--subdirectory-filter',
        targetPath,
        '--tag-name-filter',
        'cat',
        force ? '-f' : '',
        '--',
        '--all',
    ], {
        cwd,
        stripAnsi: true,
        stdio,
    });
    let msg = (0, stringify_1.crossSpawnOutput)(cp.output);
    if (/Cannot create a new backup/i.test(msg)) {
        throw new Error(msg);
    }
    else if (cp.error) {
        throw cp.error;
    }
    return cp;
}
exports.default = gitChangeRootDir;
//# sourceMappingURL=index.js.map