"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const gitlog2_1 = require("gitlog2");
exports.REVISION_DEFAULT = 'HEAD';
function revisionRangeData(from, to = 'HEAD', options) {
    if (typeof from == 'number') {
        ({ from, to } = resolveRevision(from, to, options));
    }
    return { from, to };
}
exports.revisionRangeData = revisionRangeData;
function revisionRange(from, to = 'HEAD', options) {
    ({ from, to } = revisionRangeData(from, to, options));
    return `${from}..${to}`;
}
exports.revisionRange = revisionRange;
function resolveLog(from = 20, to = 'HEAD', options) {
    if (typeof from == 'string') {
        return gitlog2_1.default({
            repo: getCwd(options),
            branch: revisionRange(from, to),
            number: options.maxNumber || -1,
        });
    }
    return gitlog2_1.default({
        repo: getCwd(options),
        number: from + 1,
        branch: `${to}`,
    });
}
exports.resolveLog = resolveLog;
function resolveRevision(range, revision = 'HEAD', options) {
    revision = revision || 'HEAD';
    let a = resolveLog(range, revision, options);
    let len = a.length;
    let fromName = (typeof range == 'number' && len > 1) ? `${revision}~${len - 1}` : (typeof range == 'string' ? range : revision);
    let toName = revision;
    let from = fromName;
    let to = toName;
    if (options && (options.realHash || options.fullHash)) {
        if (options.fullHash) {
            from = a[len - 1].hash;
            to = a[0].hash;
        }
        else {
            from = a[len - 1].abbrevHash;
            to = a[0].abbrevHash;
        }
    }
    return {
        from,
        to,
        fromName,
        toName,
        length: a.length,
    };
}
exports.resolveRevision = resolveRevision;
function getCwd(cwd) {
    return cwd && (typeof cwd == 'string' ? cwd : cwd.cwd) || process.cwd();
}
exports.getCwd = getCwd;
const self = require("./index");
exports.default = self;
