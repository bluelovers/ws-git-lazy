"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitClone = gitClone;
exports.gitCloneSync = gitCloneSync;
const tslib_1 = require("tslib");
const spawn_1 = require("@git-lazy/spawn");
const util_1 = require("./lib/util");
tslib_1.__exportStar(require("./lib/types"), exports);
function gitClone(remote, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    const args = (0, util_1.gitCloneCmd)(remote, options);
    return (0, spawn_1.crossSpawnGitAsync)('git', args, {
        stdio: 'inherit',
        ...options.spawnOptions,
        cwd,
    });
}
function gitCloneSync(remote, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    const args = (0, util_1.gitCloneCmd)(remote, options);
    return (0, spawn_1.crossSpawnGitSync)('git', args, {
        stdio: 'inherit',
        ...options.spawnOptions,
        cwd,
    });
}
exports.default = gitClone;
//# sourceMappingURL=index.js.map