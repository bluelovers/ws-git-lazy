"use strict";
/**
 * Created by user on 2020/5/27.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCrossSpawnArgv = exports.crossSpawnOutput = exports.getCrossSpawnError = exports.stripAnsi = void 0;
const crlf_normalize_1 = require("crlf-normalize");
const core_1 = require("cross-spawn-extra/core");
exports.stripAnsi = core_1.CrossSpawnExtra.stripAnsi;
function getCrossSpawnError(cp) {
    return cp.error
        // @ts-ignore
        || cp.errorCrossSpawn;
}
exports.getCrossSpawnError = getCrossSpawnError;
function crossSpawnOutput(buf, options = {
    clearEol: true,
}) {
    let output = '';
    if (!Buffer.isBuffer(buf) && Array.isArray(buf)) {
        output = buf
            .filter(function (b) {
            return !(!b || !b.length);
        })
            .map(function (b) {
            return b.toString();
        })
            .join("\n");
    }
    else {
        output = (buf || '').toString();
    }
    if (options.stripAnsi) {
        output = (0, exports.stripAnsi)(output);
    }
    output = (0, crlf_normalize_1.crlf)(output);
    if (options.clearEol || options.clearEol == null) {
        output = output.replace(/\n+$/g, '');
    }
    return output;
}
exports.crossSpawnOutput = crossSpawnOutput;
function filterCrossSpawnArgv(args, fn) {
    fn = fn || ((value) => typeof value !== 'undefined' && value !== null);
    return args.filter(fn);
}
exports.filterCrossSpawnArgv = filterCrossSpawnArgv;
//# sourceMappingURL=util.js.map