"use strict";
/**
 * Created by user on 2020/6/15.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCloneSync = exports.gitClone = void 0;
const spawn_1 = require("@git-lazy/spawn");
const util_1 = require("./lib/util");
__exportStar(require("./lib/types"), exports);
function gitClone(remote, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    const args = util_1.gitCloneCmd(remote, options);
    return spawn_1.crossSpawnGitAsync('git', args, {
        stdio: 'inherit',
        ...options.spawnOptions,
        cwd,
    });
}
exports.gitClone = gitClone;
function gitCloneSync(remote, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    const args = util_1.gitCloneCmd(remote, options);
    return spawn_1.crossSpawnGitSync('git', args, {
        stdio: 'inherit',
        ...options.spawnOptions,
        cwd,
    });
}
exports.gitCloneSync = gitCloneSync;
exports.default = gitClone;
//# sourceMappingURL=index.js.map