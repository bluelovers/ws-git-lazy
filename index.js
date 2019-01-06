"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const gitlog2_1 = require("gitlog2");
exports.REVISION_DEFAULT = 'HEAD';
function isRevision(s) {
    if (!/^HEAD|^\d+$/.test(s) && /^\w{7,}$/.test(s)) {
        return true;
    }
    return false;
}
exports.isRevision = isRevision;
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
exports.revisionRangeData = revisionRangeData;
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
exports.revisionBefore = revisionBefore;
function revisionRange(from, to = 'HEAD', options = {}) {
    ({ from, to } = revisionRangeData(from, to, options));
    return `${from}..${to}`;
}
exports.revisionRange = revisionRange;
function resolveLog(from = 20, to = 'HEAD', options = {}) {
    options = getOptions(options);
    if (typeof from == 'string') {
        return gitlog2_1.default(Object.assign({}, options.gitlogOptions, { repo: getCwd(options), branch: revisionRange(from, to), number: options.maxNumber || -1 }));
    }
    return gitlog2_1.default(Object.assign({}, options.gitlogOptions, { repo: getCwd(options), number: from + 1, branch: `${to}` }));
}
exports.resolveLog = resolveLog;
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
            a = gitlog2_1.default(Object.assign({}, options.gitlogOptions, { repo: getCwd(options), branch: to, number: 1 }));
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
exports.resolveRevision = resolveRevision;
function getOptions(cwd) {
    if (typeof cwd == 'string') {
        return {
            cwd,
        };
    }
    return cwd;
}
exports.getOptions = getOptions;
function getCwd(cwd) {
    return cwd && (typeof cwd == 'string' ? cwd : cwd.cwd) || process.cwd();
}
exports.getCwd = getCwd;
const self = require("./index");
exports.default = self;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgscUNBQTZFO0FBRWhFLFFBQUEsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBZXZDLFNBQWdCLFVBQVUsQ0FBQyxDQUFTO0lBRW5DLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ2hEO1FBQ0MsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2QsQ0FBQztBQVJELGdDQVFDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsSUFBcUIsRUFBRSxLQUFhLE1BQU0sRUFBRSxVQUE2QixFQUFFO0lBRTVHLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxJQUFJLENBQUMsQ0FBWSxPQUFRLENBQUMsUUFBUSxJQUFlLE9BQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDekk7UUFDQyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVEsSUFBSSxDQUFZLE9BQVEsQ0FBQyxZQUFZLEVBQ2hFO1lBQ0MsSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU1QixPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzVCO1FBRUQsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0lBRUQsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBaEJELDhDQWdC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LENBQUM7QUFDckYsQ0FBQztBQUhELHdCQUdDO0FBRUQsZ0NBQWdDO0FBRWhDLGtCQUFlLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvNS8xNC8wMTQuXG4gKi9cblxuaW1wb3J0IGdpdGxvZywgeyBJT3B0aW9ucyBhcyBJR2l0bG9nT3B0aW9ucywgSVJldHVybkNvbW1pdHMgfSBmcm9tICdnaXRsb2cyJztcblxuZXhwb3J0IGNvbnN0IFJFVklTSU9OX0RFRkFVTFQgPSAnSEVBRCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNcbntcblx0Y3dkPzogc3RyaW5nLFxuXHRyZWFsSGFzaD86IGJvb2xlYW4sXG5cdGZ1bGxIYXNoPzogYm9vbGVhbixcblx0bWF4TnVtYmVyPzogbnVtYmVyLFxuXG5cdGV4Y2x1ZGVTdGFydD86IGJvb2xlYW4sXG5cblx0Z2l0bG9nT3B0aW9ucz86IElHaXRsb2dPcHRpb25zLFxufVxuZXhwb3J0IHsgSUdpdGxvZ09wdGlvbnMgfVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXZpc2lvbihzOiBzdHJpbmcpXG57XG5cdGlmICghL15IRUFEfF5cXGQrJC8udGVzdChzKSAmJiAvXlxcd3s3LH0kLy50ZXN0KHMpKVxuXHR7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZpc2lvblJhbmdlRGF0YShmcm9tOiBudW1iZXIgfCBzdHJpbmcsIHRvOiBzdHJpbmcgPSAnSEVBRCcsIG9wdGlvbnM6IHN0cmluZyB8IElPcHRpb25zID0ge30pXG57XG5cdGlmICh0eXBlb2YgZnJvbSA9PSAnbnVtYmVyJyB8fCAoKCg8SU9wdGlvbnM+b3B0aW9ucykucmVhbEhhc2ggfHwgKDxJT3B0aW9ucz5vcHRpb25zKS5mdWxsSGFzaCkgJiYgKCFpc1JldmlzaW9uKGZyb20pIHx8ICFpc1JldmlzaW9uKHRvKSkpKVxuXHR7XG5cdFx0aWYgKHR5cGVvZiBmcm9tID09ICdzdHJpbmcnICYmICEoPElPcHRpb25zPm9wdGlvbnMpLmV4Y2x1ZGVTdGFydClcblx0XHR7XG5cdFx0XHRmcm9tID0gcmV2aXNpb25CZWZvcmUoZnJvbSk7XG5cblx0XHRcdG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbnMpO1xuXHRcdFx0b3B0aW9ucy5leGNsdWRlU3RhcnQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdCh7IGZyb20sIHRvIH0gPSByZXNvbHZlUmV2aXNpb24oZnJvbSwgdG8sIG9wdGlvbnMpKTtcblx0fVxuXG5cdHJldHVybiB7IGZyb20sIHRvIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZpc2lvbkJlZm9yZShyZXY6IHN0cmluZywgbjogbnVtYmVyID0gMSlcbntcblx0aWYgKHR5cGVvZiByZXYgPT09ICdudW1iZXInIHx8IC9eXFxkezEsN30kLy50ZXN0KHJldikpXG5cdHtcblx0XHQvL1xuXHR9XG5cdGVsc2UgaWYgKC9+XFxkKyQvLnRlc3QocmV2KSlcblx0e1xuXHRcdHJldiA9IHJldi5yZXBsYWNlKC8ofikoXFxkKykkLywgZnVuY3Rpb24gKC4uLm0pXG5cdFx0e1xuXHRcdFx0cmV0dXJuIG1bMV0gKyAoTnVtYmVyKG1bMl0pICsgbilcblx0XHR9KTtcblx0fVxuXHRlbHNlIGlmICgvXlxcdyskLy50ZXN0KHJldikpXG5cdHtcblx0XHRyZXYgKz0gJ34nICsgbjtcblx0fVxuXG5cdHJldHVybiByZXY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZpc2lvblJhbmdlKGZyb206IG51bWJlciB8IHN0cmluZywgdG86IHN0cmluZyA9ICdIRUFEJywgb3B0aW9uczogc3RyaW5nIHwgSU9wdGlvbnMgPSB7fSlcbntcblx0KHsgZnJvbSwgdG8gfSA9IHJldmlzaW9uUmFuZ2VEYXRhKGZyb20sIHRvLCBvcHRpb25zKSk7XG5cblx0cmV0dXJuIGAke2Zyb219Li4ke3RvfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlTG9nKGZyb206IG51bWJlciB8IHN0cmluZyA9IDIwLCB0bzogc3RyaW5nID0gJ0hFQUQnLCBvcHRpb25zOiBzdHJpbmcgfCBJT3B0aW9ucyA9IHt9KTogSVJldHVybkNvbW1pdHNcbntcblx0b3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9ucyk7XG5cblx0aWYgKHR5cGVvZiBmcm9tID09ICdzdHJpbmcnKVxuXHR7XG5cdFx0cmV0dXJuIGdpdGxvZyh7XG5cdFx0XHQuLi5vcHRpb25zLmdpdGxvZ09wdGlvbnMsXG5cblx0XHRcdHJlcG86IGdldEN3ZChvcHRpb25zKSxcblx0XHRcdGJyYW5jaDogcmV2aXNpb25SYW5nZShmcm9tLCB0byksXG5cblx0XHRcdG51bWJlcjogKDxJT3B0aW9ucz5vcHRpb25zKS5tYXhOdW1iZXIgfHwgLTEsXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gZ2l0bG9nKHtcblx0XHQuLi5vcHRpb25zLmdpdGxvZ09wdGlvbnMsXG5cblx0XHRyZXBvOiBnZXRDd2Qob3B0aW9ucyksXG5cdFx0bnVtYmVyOiBmcm9tICsgMSxcblx0XHRicmFuY2g6IGAke3RvfWAsXG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVJldmlzaW9uKHJhbmdlOiBudW1iZXIgfCBzdHJpbmcsIHJldmlzaW9uOiBzdHJpbmcgPSAnSEVBRCcsIG9wdGlvbnM6IHN0cmluZyB8IElPcHRpb25zID0ge30pXG57XG5cdHJldmlzaW9uID0gcmV2aXNpb24gfHwgJ0hFQUQnO1xuXG5cdG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbnMpO1xuXG5cdGxldCBhID0gcmVzb2x2ZUxvZyhyYW5nZSwgcmV2aXNpb24sIG9wdGlvbnMpO1xuXG5cdGxldCBsZW4gPSBhLmxlbmd0aDtcblxuXHRsZXQgZnJvbU5hbWUgPSAodHlwZW9mIHJhbmdlID09ICdudW1iZXInICYmIGxlbiA+IDEpID8gYCR7cmV2aXNpb259fiR7bGVuIC0gMX1gIDogKHR5cGVvZiByYW5nZSA9PSAnc3RyaW5nJyA/IHJhbmdlIDogcmV2aXNpb24pO1xuXHRsZXQgdG9OYW1lID0gcmV2aXNpb247XG5cblx0bGV0IGZyb20gPSBmcm9tTmFtZTtcblx0bGV0IHRvID0gdG9OYW1lO1xuXG5cdGlmIChvcHRpb25zICYmICgoPElPcHRpb25zPm9wdGlvbnMpLnJlYWxIYXNoIHx8ICg8SU9wdGlvbnM+b3B0aW9ucykuZnVsbEhhc2gpKVxuXHR7XG5cdFx0aWYgKGEubGVuZ3RoID09PSAwKVxuXHRcdHtcblx0XHRcdGEgPSBnaXRsb2coe1xuXG5cdFx0XHRcdC4uLm9wdGlvbnMuZ2l0bG9nT3B0aW9ucyxcblxuXHRcdFx0XHRyZXBvOiBnZXRDd2Qob3B0aW9ucyksXG5cdFx0XHRcdGJyYW5jaDogdG8sXG5cblx0XHRcdFx0bnVtYmVyOiAxLFxuXHRcdFx0fSk7XG5cblx0XHRcdGxlbiA9IGEubGVuZ3RoO1xuXHRcdH1cblxuXHRcdGlmICgoPElPcHRpb25zPm9wdGlvbnMpLmZ1bGxIYXNoKVxuXHRcdHtcblx0XHRcdGZyb20gPSBhW2xlbiAtIDFdLmhhc2g7XG5cdFx0XHR0byA9IGFbMF0uaGFzaDtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGZyb20gPSBhW2xlbiAtIDFdLmFiYnJldkhhc2g7XG5cdFx0XHR0byA9IGFbMF0uYWJicmV2SGFzaDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGZyb20sXG5cdFx0dG8sXG5cblx0XHRmcm9tTmFtZSxcblx0XHR0b05hbWUsXG5cblx0XHRsZW5ndGg6IGEubGVuZ3RoLFxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3B0aW9ucyhjd2Q/OiBzdHJpbmcgfCBJT3B0aW9ucyk6IElPcHRpb25zXG57XG5cdGlmICh0eXBlb2YgY3dkID09ICdzdHJpbmcnKVxuXHR7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGN3ZCxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIGN3ZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN3ZChjd2Q/OiBzdHJpbmcgfCBJT3B0aW9ucylcbntcblx0cmV0dXJuIGN3ZCAmJiAodHlwZW9mIGN3ZCA9PSAnc3RyaW5nJyA/IGN3ZCA6ICg8SU9wdGlvbnM+Y3dkKS5jd2QpIHx8IHByb2Nlc3MuY3dkKCk7XG59XG5cbmltcG9ydCAqIGFzIHNlbGYgZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBkZWZhdWx0IHNlbGY7XG4iXX0=