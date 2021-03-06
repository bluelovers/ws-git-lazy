"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitTagSync = exports.gitTag = exports.buildCmd = void 0;
const spawn_1 = require("@git-lazy/spawn");
function buildCmd(tag, options) {
    var _a;
    const args = [
        "tag",
        tag,
        "-m",
        (_a = options === null || options === void 0 ? void 0 : options.message) !== null && _a !== void 0 ? _a : tag,
    ];
    if (options === null || options === void 0 ? void 0 : options.forceGitTag) {
        args.push("--force");
    }
    if (options === null || options === void 0 ? void 0 : options.signGitTag) {
        args.push("--sign");
    }
    return args;
}
exports.buildCmd = buildCmd;
function gitTag(tag, options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(tag, options);
    return spawn_1.crossSpawnGitAsync("git", args, {
        ...spawnOptions,
        cwd,
    });
}
exports.gitTag = gitTag;
function gitTagSync(tag, options, spawnOptions) {
    var _a, _b;
    let cwd = (_b = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : spawnOptions === null || spawnOptions === void 0 ? void 0 : spawnOptions.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    const args = buildCmd(tag, options);
    return spawn_1.crossSpawnGitSync("git", args, {
        ...spawnOptions,
        cwd,
    });
}
exports.gitTagSync = gitTagSync;
exports.default = gitTag;
//# sourceMappingURL=index.js.map