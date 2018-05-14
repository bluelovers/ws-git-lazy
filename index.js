"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gitlog = require("gitlog");
function revisionRange(from, to = 'HEAD', options) {
    if (typeof from == 'number') {
        ({ from, to } = resolveRevision(from, to, options));
    }
    if (from == to) {
        return from;
    }
    return `${from}..${to}`;
}
exports.revisionRange = revisionRange;
function resolveLog(range = 20, revision = 'HEAD', options) {
    return gitlog({
        repo: getCwd(options),
        number: range,
        branch: `${revision}`,
    });
}
exports.resolveLog = resolveLog;
function resolveRevision(range, revision = 'HEAD', options) {
    revision = revision || 'HEAD';
    let a = resolveLog(range, revision, options);
    range = a.length;
    let fromName = `${revision}~${range}`;
    let toName = revision;
    let from = fromName;
    let to = toName;
    if (options && (options.realHash || options.fullHash)) {
        if (options.fullHash) {
            from = a[range - 1].hash;
            to = a[0].hash;
        }
        else {
            from = a[range - 1].abbrevHash;
            to = a[0].abbrevHash;
        }
    }
    return {
        from,
        to,
        fromName,
        toName,
    };
}
exports.resolveRevision = resolveRevision;
function getCwd(cwd) {
    return cwd && (typeof cwd == 'string' ? cwd : cwd.cwd) || process.cwd();
}
exports.getCwd = getCwd;
const self = require("./index");
exports.default = self;
