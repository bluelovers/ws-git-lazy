"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("cross-spawn-extra/core");
const crlf_normalize_1 = require("crlf-normalize");
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
    if (Array.isArray(buf)) {
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
        output = exports.stripAnsi(output);
    }
    output = crlf_normalize_1.crlf(output);
    if (options.clearEol || options.clearEol == null) {
        output = output.replace(/\n+$/g, '');
    }
    return output;
}
exports.crossSpawnOutput = crossSpawnOutput;
function filterCrossSpawnArgv(args, fn) {
    fn = fn || ((value) => value != null);
    return args.filter(fn);
}
exports.filterCrossSpawnArgv = filterCrossSpawnArgv;
exports.default = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILGlEQUEwSztBQUUxSyxtREFBc0M7QUFFekIsUUFBQSxTQUFTLEdBQUcsc0JBQWUsQ0FBQyxTQUFTLENBQUM7QUFFbkQsU0FBZ0Isa0JBQWtCLENBQThCLEVBQVc7SUFFMUUsT0FBTyxFQUFFLENBQUMsS0FBSztRQUNkLGFBQWE7V0FDVixFQUFFLENBQUMsZUFBZSxDQUNwQjtBQUNILENBQUM7QUFORCxnREFNQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEdBQXdDLEVBQUUsVUFHdkU7SUFDSCxRQUFRLEVBQUUsSUFBSTtDQUNkO0lBRUEsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWhCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFDdEI7UUFDQyxNQUFNLEdBQUcsR0FBRzthQUNWLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFFbEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDMUIsQ0FBQyxDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUVmLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNaO1NBRUQ7UUFDQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDaEM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQ3JCO1FBQ0MsTUFBTSxHQUFHLGlCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0I7SUFFRCxNQUFNLEdBQUcscUJBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV0QixJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQ2hEO1FBQ0MsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDO0FBeENELDRDQXdDQztBQUVELFNBQWdCLG9CQUFvQixDQUFvQixJQUFTLEVBQUUsRUFBMEI7SUFFNUYsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUM7SUFFekMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFMRCxvREFLQztBQUVELGtCQUFlLE9BQWtDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzMvMTAuXG4gKi9cblxuaW1wb3J0IHsgU3Bhd25BU3luY1JldHVybnMsIFNwYXduQVN5bmNSZXR1cm5zUHJvbWlzZSwgSVNwYXduQVN5bmNFcnJvciwgU3Bhd25TeW5jUmV0dXJucywgU3Bhd25PcHRpb25zLCBTcGF3blN5bmNPcHRpb25zLCBDcm9zc1NwYXduRXh0cmEgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS9jb3JlJztcblxuaW1wb3J0IHsgY3JsZiB9IGZyb20gJ2NybGYtbm9ybWFsaXplJztcblxuZXhwb3J0IGNvbnN0IHN0cmlwQW5zaSA9IENyb3NzU3Bhd25FeHRyYS5zdHJpcEFuc2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcm9zc1NwYXduRXJyb3I8VCBleHRlbmRzIFNwYXduQVN5bmNSZXR1cm5zPihjcDogVCB8IGFueSk6IElTcGF3bkFTeW5jRXJyb3I8VD5cbntcblx0cmV0dXJuIGNwLmVycm9yXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHx8IGNwLmVycm9yQ3Jvc3NTcGF3blxuXHRcdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyb3NzU3Bhd25PdXRwdXQoYnVmOiBTcGF3blN5bmNSZXR1cm5zW1wib3V0cHV0XCJdIHwgQnVmZmVyLCBvcHRpb25zOiB7XG5cdGNsZWFyRW9sPzogYm9vbGVhbixcblx0c3RyaXBBbnNpPzogYm9vbGVhbixcbn0gPSB7XG5cdGNsZWFyRW9sOiB0cnVlLFxufSk6IHN0cmluZ1xue1xuXHRsZXQgb3V0cHV0ID0gJyc7XG5cblx0aWYgKEFycmF5LmlzQXJyYXkoYnVmKSlcblx0e1xuXHRcdG91dHB1dCA9IGJ1ZlxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbiAoYilcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuICEoIWIgfHwgIWIubGVuZ3RoKVxuXHRcdFx0fSlcblx0XHRcdC5tYXAoZnVuY3Rpb24gKGIpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBiLnRvU3RyaW5nKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmpvaW4oXCJcXG5cIilcblx0fVxuXHRlbHNlXG5cdHtcblx0XHRvdXRwdXQgPSAoYnVmIHx8ICcnKS50b1N0cmluZygpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMuc3RyaXBBbnNpKVxuXHR7XG5cdFx0b3V0cHV0ID0gc3RyaXBBbnNpKG91dHB1dCk7XG5cdH1cblxuXHRvdXRwdXQgPSBjcmxmKG91dHB1dCk7XG5cblx0aWYgKG9wdGlvbnMuY2xlYXJFb2wgfHwgb3B0aW9ucy5jbGVhckVvbCA9PSBudWxsKVxuXHR7XG5cdFx0b3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcbiskL2csICcnKTtcblx0fVxuXG5cdHJldHVybiBvdXRwdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJDcm9zc1NwYXduQXJndjxUIGV4dGVuZHMgdW5rbm93bj4oYXJnczogVFtdLCBmbj86ICh2YWx1ZTogVCkgPT4gYm9vbGVhbilcbntcblx0Zm4gPSBmbiB8fCAoKHZhbHVlOiBUKSA9PiB2YWx1ZSAhPSBudWxsKTtcblxuXHRyZXR1cm4gYXJncy5maWx0ZXIoZm4pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBleHBvcnRzIGFzIHR5cGVvZiBpbXBvcnQoJy4vdXRpbCcpO1xuIl19