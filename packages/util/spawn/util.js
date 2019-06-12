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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILGlEQUEwSztBQUUxSyxtREFBc0M7QUFFekIsUUFBQSxTQUFTLEdBQUcsc0JBQWUsQ0FBQyxTQUFTLENBQUM7QUFFbkQsU0FBZ0Isa0JBQWtCLENBQThCLEVBQVc7SUFFMUUsT0FBTyxFQUFFLENBQUMsS0FBSztRQUNkLGFBQWE7V0FDVixFQUFFLENBQUMsZUFBZSxDQUNwQjtBQUNILENBQUM7QUFORCxnREFNQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEdBQXdDLEVBQUUsVUFHdkU7SUFDSCxRQUFRLEVBQUUsSUFBSTtDQUNkO0lBRUEsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWhCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQy9DO1FBQ0MsTUFBTSxHQUFHLEdBQUc7YUFDVixNQUFNLENBQUMsVUFBVSxDQUFDO1lBRWxCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQzthQUNELEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFFZixPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDWjtTQUVEO1FBQ0MsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2hDO0lBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUNyQjtRQUNDLE1BQU0sR0FBRyxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCO0lBRUQsTUFBTSxHQUFHLHFCQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEIsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxFQUNoRDtRQUNDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNyQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQXhDRCw0Q0F3Q0M7QUFFRCxTQUFnQixvQkFBb0IsQ0FBb0IsSUFBUyxFQUFFLEVBQTBCO0lBRTVGLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBRXpDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBTEQsb0RBS0M7QUFFRCxrQkFBZSxPQUFrQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCB7IFNwYXduQVN5bmNSZXR1cm5zLCBTcGF3bkFTeW5jUmV0dXJuc1Byb21pc2UsIElTcGF3bkFTeW5jRXJyb3IsIFNwYXduU3luY1JldHVybnMsIFNwYXduT3B0aW9ucywgU3Bhd25TeW5jT3B0aW9ucywgQ3Jvc3NTcGF3bkV4dHJhIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEvY29yZSc7XG5cbmltcG9ydCB7IGNybGYgfSBmcm9tICdjcmxmLW5vcm1hbGl6ZSc7XG5cbmV4cG9ydCBjb25zdCBzdHJpcEFuc2kgPSBDcm9zc1NwYXduRXh0cmEuc3RyaXBBbnNpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3Jvc3NTcGF3bkVycm9yPFQgZXh0ZW5kcyBTcGF3bkFTeW5jUmV0dXJucz4oY3A6IFQgfCBhbnkpOiBJU3Bhd25BU3luY0Vycm9yPFQ+XG57XG5cdHJldHVybiBjcC5lcnJvclxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHR8fCBjcC5lcnJvckNyb3NzU3Bhd25cblx0XHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NwYXduT3V0cHV0KGJ1ZjogU3Bhd25TeW5jUmV0dXJuc1tcIm91dHB1dFwiXSB8IEJ1ZmZlciwgb3B0aW9uczoge1xuXHRjbGVhckVvbD86IGJvb2xlYW4sXG5cdHN0cmlwQW5zaT86IGJvb2xlYW4sXG59ID0ge1xuXHRjbGVhckVvbDogdHJ1ZSxcbn0pOiBzdHJpbmdcbntcblx0bGV0IG91dHB1dCA9ICcnO1xuXG5cdGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikgJiYgQXJyYXkuaXNBcnJheShidWYpKVxuXHR7XG5cdFx0b3V0cHV0ID0gYnVmXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uIChiKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gISghYiB8fCAhYi5sZW5ndGgpXG5cdFx0XHR9KVxuXHRcdFx0Lm1hcChmdW5jdGlvbiAoYilcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIGIudG9TdHJpbmcoKTtcblx0XHRcdH0pXG5cdFx0XHQuam9pbihcIlxcblwiKVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdG91dHB1dCA9IChidWYgfHwgJycpLnRvU3RyaW5nKCk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zdHJpcEFuc2kpXG5cdHtcblx0XHRvdXRwdXQgPSBzdHJpcEFuc2kob3V0cHV0KTtcblx0fVxuXG5cdG91dHB1dCA9IGNybGYob3V0cHV0KTtcblxuXHRpZiAob3B0aW9ucy5jbGVhckVvbCB8fCBvcHRpb25zLmNsZWFyRW9sID09IG51bGwpXG5cdHtcblx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvXFxuKyQvZywgJycpO1xuXHR9XG5cblx0cmV0dXJuIG91dHB1dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckNyb3NzU3Bhd25Bcmd2PFQgZXh0ZW5kcyB1bmtub3duPihhcmdzOiBUW10sIGZuPzogKHZhbHVlOiBUKSA9PiBib29sZWFuKVxue1xuXHRmbiA9IGZuIHx8ICgodmFsdWU6IFQpID0+IHZhbHVlICE9IG51bGwpO1xuXG5cdHJldHVybiBhcmdzLmZpbHRlcihmbik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHMgYXMgdHlwZW9mIGltcG9ydCgnLi91dGlsJyk7XG4iXX0=