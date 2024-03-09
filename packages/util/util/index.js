"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCWD = getCWD;
exports.notEmptyString = notEmptyString;
const fs_1 = require("fs");
const path_1 = require("path");
function getCWD(cwd, realpath, failback) {
    if (notEmptyString(cwd)) {
        //cwd = cwd.trim();
    }
    else if (cwd == null) {
        if (typeof failback === 'function') {
            cwd = failback();
        }
        else if (notEmptyString(failback)) {
            cwd = failback;
        }
        else {
            return process.cwd();
        }
        if (!notEmptyString(cwd)) {
            throw new Error(`cwd is ${cwd} by ${failback}`);
        }
    }
    else {
        cwd = undefined;
    }
    if (realpath && cwd != null) {
        if (realpath === 1 /* getCWD.EnumRealPath.FS */) {
            return (0, fs_1.realpathSync)(cwd);
        }
        return (0, path_1.resolve)(cwd);
    }
    return cwd;
}
function notEmptyString(s) {
    return typeof s === 'string' && s.trim() !== '';
}
exports.default = exports;
//console.log(getCWD(null, true, 'll'));
//# sourceMappingURL=index.js.map