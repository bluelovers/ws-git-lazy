"use strict";
/**
 * Created by user on 2020/5/27.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.sync = exports.checkGitOutput = exports.crossSpawnGitAsync = exports.crossSpawnGitSync = exports.crossSpawnOutput = void 0;
const debug_1 = require("@git-lazy/debug");
const util_1 = require("./lib/util");
Object.defineProperty(exports, "crossSpawnOutput", { enumerable: true, get: function () { return util_1.crossSpawnOutput; } });
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
__exportStar(require("./lib/types"), exports);
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
    let cp = cross_spawn_extra_1.default.sync(command, args, options);
    print && debug_1.console.log(util_1.crossSpawnOutput(cp.output));
    checkGitOutput(cp);
    return cp;
}
exports.crossSpawnGitSync = crossSpawnGitSync;
exports.sync = crossSpawnGitSync;
/**
 * 適用於 git 的 crossSpawnAsync
 */
function crossSpawnGitAsync(command, args, options) {
    return cross_spawn_extra_1.default.async(command, args, options)
        .then(checkGitOutput);
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
    if (cp.error) {
        // @ts-ignore
        cp.errorCrossSpawn = cp.errorCrossSpawn || cp.error;
    }
    else if (cp.stderr && cp.stderr.length) {
        s1 = String(cp.stderr);
        if (!cp.error) {
            let s2 = util_1.stripAnsi(s1);
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
exports.default = crossSpawnGitAsync;
//# sourceMappingURL=index.js.map