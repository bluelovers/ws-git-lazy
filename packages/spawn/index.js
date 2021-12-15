"use strict";
/**
 * Created by user on 2020/5/27.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.sync = exports.checkGitOutput = exports.crossSpawnGitAsync = exports.crossSpawnGitSync = exports.crossSpawnOutput = void 0;
const tslib_1 = require("tslib");
const debug_1 = require("@git-lazy/debug");
const util_1 = require("./lib/util");
Object.defineProperty(exports, "crossSpawnOutput", { enumerable: true, get: function () { return util_1.crossSpawnOutput; } });
const cross_spawn_extra_1 = tslib_1.__importDefault(require("cross-spawn-extra"));
tslib_1.__exportStar(require("./lib/types"), exports);
/**
 * 適用於 git 的 crossSpawnSync
 */
function crossSpawnGitSync(command, args, options) {
    let print;
    if (options) {
        if (options.stdio == 'inherit') {
            print = true;
            delete options.stdio;
        }
    }
    debug_1.debug.log(command, args, options);
    let cp = cross_spawn_extra_1.default.sync(command, args, options);
    print && debug_1.console.log((0, util_1.crossSpawnOutput)(cp.output));
    checkGitOutput(cp, options === null || options === void 0 ? void 0 : options.throwError, options === null || options === void 0 ? void 0 : options.printStderr);
    return cp;
}
exports.crossSpawnGitSync = crossSpawnGitSync;
exports.sync = crossSpawnGitSync;
/**
 * 適用於 git 的 crossSpawnAsync
 */
function crossSpawnGitAsync(command, args, options) {
    debug_1.debug.log(command, args, options);
    return cross_spawn_extra_1.default.async(command, args, options)
        .then(cp => checkGitOutput(cp, options === null || options === void 0 ? void 0 : options.throwError, options === null || options === void 0 ? void 0 : options.printStderr));
}
exports.crossSpawnGitAsync = crossSpawnGitAsync;
exports.async = crossSpawnGitAsync;
/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
function checkGitOutput(cp, throwError, printStderr) {
    let s1;
    throwError = throwError !== null && throwError !== void 0 ? throwError : true;
    if (cp.error) {
        // @ts-ignore
        cp.errorCrossSpawn = cp.errorCrossSpawn || cp.error;
    }
    else if (cp.stderr && cp.stderr.length) {
        s1 = String(cp.stderr);
        if (!cp.error) {
            let s2 = (0, util_1.stripAnsi)(s1);
            if (/^fatal\:/im.test(s2) || /^unknown option:/i.test(s2)) {
                let e = new Error(s1);
                // @ts-ignore
                e.child = cp;
                cp.error = cp.error || e;
                // @ts-ignore
                cp.errorCrossSpawn = cp.errorCrossSpawn || e;
            }
        }
    }
    // @ts-ignore
    if (!cp.error && cp.exitCode) {
        // @ts-ignore
        cp.error = new Error(`Process finished with exit code ${cp.exitCode}`);
    }
    if (throwError && cp.error) {
        throw cp.error;
    }
    if (printStderr && s1 != null) {
        debug_1.debugConsole.info(`cp.stderr`);
        debug_1.debugConsole.warn(s1);
    }
    return cp;
}
exports.checkGitOutput = checkGitOutput;
crossSpawnGitAsync.async = crossSpawnGitAsync;
crossSpawnGitAsync.sync = crossSpawnGitSync;
crossSpawnGitAsync.default = crossSpawnGitAsync;
exports.default = crossSpawnGitAsync;
//# sourceMappingURL=index.js.map