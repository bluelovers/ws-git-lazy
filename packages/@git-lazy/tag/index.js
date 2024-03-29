"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCmd = buildCmd;
exports.gitTag = gitTag;
exports.gitTagSync = gitTagSync;
const spawn_1 = require("@git-lazy/spawn");
const util_1 = require("@git-lazy/spawn/lib/util");
function buildCmd(tag, options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    const args = [
        "tag",
        options.annotated && '-a',
        tag,
    ];
    if ((_a = options.message) === null || _a === void 0 ? void 0 : _a.length) {
        args.push('-m');
        args.push(options.message);
    }
    if (options.forceGitTag) {
        args.push("--force");
    }
    if (options.signGitTag) {
        args.push("--sign");
    }
    if (options.target) {
        args.push(options.target);
    }
    return (0, util_1.filterCrossSpawnArgv)(args);
}
function gitTag(tag, options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(tag, options);
    return (0, spawn_1.crossSpawnGitAsync)("git", args, {
        ...spawnOptions,
        cwd,
    });
}
function gitTagSync(tag, options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(tag, options);
    return (0, spawn_1.crossSpawnGitSync)("git", args, {
        ...spawnOptions,
        cwd,
    });
}
exports.default = gitTag;
//# sourceMappingURL=index.js.map