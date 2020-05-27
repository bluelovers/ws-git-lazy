"use strict";
/**
 * Created by user on 2019/7/6.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._core = exports.gitChangeRootDir = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const root_1 = require("@git-lazy/root");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const util_1 = require("@git-lazy/util/spawn/util");
/**
 * https://stackoverflow.com/a/11764065/4563339
 */
function gitChangeRootDir(options) {
    const { bin = 'git', cwd, yesDoIt, force, stdio = 'inherit' } = options;
    if (!root_1.isGitRoot(cwd)) {
        throw new RangeError(`cwd not a git root ${cwd}`);
    }
    if (!yesDoIt) {
        const msg = `options.yesDoIt must be true, this is unsafe action, make sure u backup all data`;
        throw new Error(msg);
    }
    let { targetPath } = options;
    let ls = fast_glob_1.default.sync([
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
exports.gitChangeRootDir = gitChangeRootDir;
function _core(options) {
    const { bin = 'git', cwd, targetPath, force, stdio = 'inherit' } = options;
    if (typeof targetPath !== 'string' || targetPath === '') {
        throw new RangeError(`targetPath is not allow, '${targetPath}'`);
    }
    let cp = git_1.crossSpawnSync(bin, [
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
    let msg = util_1.crossSpawnOutput(cp.output);
    if (/Cannot create a new backup/i.test(msg)) {
        throw new Error(msg);
    }
    else if (cp.error) {
        throw cp.error;
    }
    return cp;
}
exports._core = _core;
exports.default = gitChangeRootDir;
//# sourceMappingURL=index.js.map