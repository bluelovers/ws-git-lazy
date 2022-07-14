"use strict";
/**
 * Created by user on 2020/5/27.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCrossSpawnArgv = exports.getCrossSpawnError = exports.stripAnsi = void 0;
var strip_ansi_1 = require("@lazy-spawn/strip-ansi");
Object.defineProperty(exports, "stripAnsi", { enumerable: true, get: function () { return strip_ansi_1.stripAnsiValue; } });
function getCrossSpawnError(cp) {
    return cp.error
        // @ts-ignore
        || cp.errorCrossSpawn;
}
exports.getCrossSpawnError = getCrossSpawnError;
function filterCrossSpawnArgv(args, fn) {
    fn = fn || ((value) => typeof value !== 'undefined' && value !== null);
    return args.filter(fn);
}
exports.filterCrossSpawnArgv = filterCrossSpawnArgv;
//# sourceMappingURL=util.js.map