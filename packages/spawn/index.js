"use strict";
/**
 * Created by user on 2020/5/27.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.sync = exports.checkGitOutput = exports.crossSpawnGitAsync = exports.crossSpawnGitSync = exports.SymbolRawArgv = exports.crossSpawnOutput = void 0;
const tslib_1 = require("tslib");
const debug_1 = require("@git-lazy/debug");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const promise_tap_then_catch_1 = require("promise-tap-then-catch");
const stringify_1 = require("@lazy-spawn/stringify");
Object.defineProperty(exports, "crossSpawnOutput", { enumerable: true, get: function () { return stringify_1.crossSpawnOutput; } });
const strip_ansi_1 = require("@lazy-spawn/strip-ansi");
tslib_1.__exportStar(require("./lib/types"), exports);
const SymbolRawArgv = Symbol.for('argv');
exports.SymbolRawArgv = SymbolRawArgv;
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
    let cp = (0, cross_spawn_extra_1.sync)(command, args, options);
    cp[SymbolRawArgv] = {
        command,
        args,
        options,
    };
    // @ts-ignore
    print && debug_1.console.log((0, stringify_1.crossSpawnOutput)(cp.output));
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
    return (0, promise_tap_then_catch_1.promiseTapLazyBoth)((0, cross_spawn_extra_1.async)(command, args, options)
        .then(cp => checkGitOutput(cp, options === null || options === void 0 ? void 0 : options.throwError, options === null || options === void 0 ? void 0 : options.printStderr)), cp => {
        cp[SymbolRawArgv] = {
            command,
            args,
            options,
        };
    });
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
            let s2 = (0, strip_ansi_1.stripAnsiValue)(s1);
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