"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVISION_DEFAULT = void 0;
exports.isRevision = isRevision;
exports.revisionRangeData = revisionRangeData;
exports.revisionBefore = revisionBefore;
exports.revisionRange = revisionRange;
exports.resolveLog = resolveLog;
exports.resolveRevision = resolveRevision;
exports.getOptions = getOptions;
exports.getCwd = getCwd;
const gitlog2_1 = require("gitlog2");
exports.REVISION_DEFAULT = 'HEAD';
function isRevision(s) {
    if (!/^HEAD|^\d+$/.test(s) && /^\w{7,}$/.test(s)) {
        return true;
    }
    return false;
}
function revisionRangeData(from, to = 'HEAD', options = {}) {
    if (typeof from == 'number' || ((options.realHash || options.fullHash) && (!isRevision(from) || !isRevision(to)))) {
        if (typeof from == 'string' && !options.excludeStart) {
            from = revisionBefore(from);
            options = getOptions(options);
            options.excludeStart = true;
        }
        ({ from, to } = resolveRevision(from, to, options));
    }
    return { from, to };
}
function revisionBefore(rev, n = 1) {
    if (typeof rev === 'number' || /^\d{1,7}$/.test(rev)) {
        //
    }
    else if (/~\d+$/.test(rev)) {
        rev = rev.replace(/(~)(\d+)$/, function (...m) {
            return m[1] + (Number(m[2]) + n);
        });
    }
    else if (/^\w+$/.test(rev)) {
        rev += '~' + n;
    }
    return rev;
}
function revisionRange(from, to = 'HEAD', options = {}) {
    ({ from, to } = revisionRangeData(from, to, options));
    return `${from}..${to}`;
}
function resolveLog(from = 20, to = 'HEAD', options = {}) {
    options = getOptions(options);
    if (typeof from == 'string') {
        return (0, gitlog2_1.gitlog)({
            ...options.gitlogOptions,
            repo: getCwd(options),
            branch: revisionRange(from, to),
            number: options.maxNumber || -1,
        });
    }
    return (0, gitlog2_1.gitlog)({
        ...options.gitlogOptions,
        repo: getCwd(options),
        number: from + 1,
        branch: `${to}`,
    });
}
function resolveRevision(range, revision = 'HEAD', options = {}) {
    revision = revision || 'HEAD';
    options = getOptions(options);
    let a = resolveLog(range, revision, options);
    let len = a.length;
    let fromName = (typeof range == 'number' && len > 1) ? `${revision}~${len - 1}` : (typeof range == 'string' ? range : revision);
    let toName = revision;
    let from = fromName;
    let to = toName;
    if (options && (options.realHash || options.fullHash)) {
        if (a.length === 0) {
            a = (0, gitlog2_1.gitlog)({
                ...options.gitlogOptions,
                repo: getCwd(options),
                branch: to,
                number: 1,
            });
            len = a.length;
        }
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
function getOptions(cwd) {
    if (typeof cwd == 'string') {
        return {
            cwd,
        };
    }
    return cwd;
}
function getCwd(cwd) {
    return cwd && (typeof cwd == 'string' ? cwd : cwd.cwd) || process.cwd();
}
exports.default = exports;
//# sourceMappingURL=index.js.map