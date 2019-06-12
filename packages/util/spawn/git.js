"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CrossSpawn = require("cross-spawn-extra");
const util_1 = require("./util");
const log_1 = require("../log");
/**
 * 適用於 git 的 crossSpawnSync
 */
function crossSpawnSync(command, args, options) {
    let print;
    if (options) {
        if (options.stdio == 'inherit') {
            print = true;
            delete options.stdio;
        }
    }
    let cp = CrossSpawn.sync(command, args, options);
    print && log_1.console.log(util_1.crossSpawnOutput(cp.output));
    checkGitOutput(cp);
    return cp;
}
exports.crossSpawnSync = crossSpawnSync;
/**
 * 適用於 git 的 crossSpawnAsync
 */
function crossSpawnAsync(command, args, options) {
    return CrossSpawn.async(command, args, options)
        .then(checkGitOutput);
}
exports.crossSpawnAsync = crossSpawnAsync;
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
        log_1.debugConsole.info(`cp.stderr`);
        log_1.debugConsole.warn(s1);
    }
    return cp;
}
exports.checkGitOutput = checkGitOutput;
exports.sync = crossSpawnSync;
exports.async = crossSpawnAsync;
exports.default = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxnREFBaUQ7QUFJakQsaUNBQXFEO0FBQ3JELGdDQUErQztBQUkvQzs7R0FFRztBQUNILFNBQWdCLGNBQWMsQ0FBNEIsT0FBZSxFQUFFLElBQXFCLEVBQUUsT0FBMEI7SUFFM0gsSUFBSSxLQUFjLENBQUM7SUFFbkIsSUFBSSxPQUFPLEVBQ1g7UUFDQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksU0FBUyxFQUM5QjtZQUNDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUE7U0FDcEI7S0FDRDtJQUVELElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUksT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVwRCxLQUFLLElBQUksYUFBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVsRCxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbkIsT0FBTyxFQUFFLENBQUM7QUFDWCxDQUFDO0FBcEJELHdDQW9CQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZUFBZSxDQUE0QixPQUFlLEVBQUUsSUFBcUIsRUFBRSxPQUFzQjtJQUV4SCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUksT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7U0FDaEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUNyQjtBQUNGLENBQUM7QUFMRCwwQ0FLQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFtRixFQUFLLEVBQUUsVUFBb0IsRUFBRSxXQUFxQjtJQUVsSyxJQUFJLEVBQVUsQ0FBQztJQUVmLElBQUksRUFBRSxDQUFDLEtBQUssRUFDWjtRQUNDLGFBQWE7UUFDYixFQUFFLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNwRDtTQUNJLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFDdEM7UUFDQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFDYjtZQUNDLElBQUksRUFBRSxHQUFHLGdCQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdkIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDekQ7Z0JBQ0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFxQixDQUFDO2dCQUUxQyxhQUFhO2dCQUNiLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUViLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ3pCLGFBQWE7Z0JBQ2IsRUFBRSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQzthQUM3QztTQUNEO0tBQ0Q7SUFFRCxJQUFJLFVBQVUsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUMxQjtRQUNDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQTtLQUNkO0lBRUQsSUFBSSxXQUFXLElBQUksRUFBRSxJQUFJLElBQUksRUFDN0I7UUFDQyxrQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvQixrQkFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0QjtJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQTNDRCx3Q0EyQ0M7QUFFWSxRQUFBLElBQUksR0FBRyxjQUFjLENBQUM7QUFDdEIsUUFBQSxLQUFLLEdBQUcsZUFBZSxDQUFDO0FBRXJDLGtCQUFlLE9BQWlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzMvMTAuXG4gKi9cblxuaW1wb3J0IENyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bi1leHRyYScpO1xuaW1wb3J0IEJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCB7IFNwYXduU3luY09wdGlvbnMsIFNwYXduT3B0aW9ucyB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhL3R5cGUnO1xuaW1wb3J0IHsgU3Bhd25BU3luY1JldHVybnMsIFNwYXduQVN5bmNSZXR1cm5zUHJvbWlzZSwgSVNwYXduQVN5bmNFcnJvciwgU3Bhd25TeW5jUmV0dXJucywgQ3Jvc3NTcGF3bkV4dHJhIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEvY29yZSc7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0LCBzdHJpcEFuc2kgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgY29uc29sZSwgZGVidWdDb25zb2xlIH0gZnJvbSAnLi4vbG9nJztcblxuZXhwb3J0ICogZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICog6YGp55So5pa8IGdpdCDnmoQgY3Jvc3NTcGF3blN5bmNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyb3NzU3Bhd25TeW5jPFQgZXh0ZW5kcyBzdHJpbmcgfCBCdWZmZXI+KGNvbW1hbmQ6IHN0cmluZywgYXJncz86IEFycmF5PHVua25vd24+LCBvcHRpb25zPzogU3Bhd25TeW5jT3B0aW9ucyk6IFNwYXduU3luY1JldHVybnM8VD5cbntcblx0bGV0IHByaW50OiBib29sZWFuO1xuXG5cdGlmIChvcHRpb25zKVxuXHR7XG5cdFx0aWYgKG9wdGlvbnMuc3RkaW8gPT0gJ2luaGVyaXQnKVxuXHRcdHtcblx0XHRcdHByaW50ID0gdHJ1ZTtcblx0XHRcdGRlbGV0ZSBvcHRpb25zLnN0ZGlvXG5cdFx0fVxuXHR9XG5cblx0bGV0IGNwID0gQ3Jvc3NTcGF3bi5zeW5jPFQ+KGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpO1xuXG5cdHByaW50ICYmIGNvbnNvbGUubG9nKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0Y2hlY2tHaXRPdXRwdXQoY3ApO1xuXG5cdHJldHVybiBjcDtcbn1cblxuLyoqXG4gKiDpgannlKjmlrwgZ2l0IOeahCBjcm9zc1NwYXduQXN5bmNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyb3NzU3Bhd25Bc3luYzxUIGV4dGVuZHMgc3RyaW5nIHwgQnVmZmVyPihjb21tYW5kOiBzdHJpbmcsIGFyZ3M/OiBBcnJheTx1bmtub3duPiwgb3B0aW9ucz86IFNwYXduT3B0aW9ucyk6IFNwYXduQVN5bmNSZXR1cm5zUHJvbWlzZTxUPlxue1xuXHRyZXR1cm4gQ3Jvc3NTcGF3bi5hc3luYzxUPihjb21tYW5kLCBhcmdzLCBvcHRpb25zKVxuXHRcdC50aGVuKGNoZWNrR2l0T3V0cHV0KVxuXHQ7XG59XG5cbi8qKlxuICog5qqi5p+lIGdpdCDovLjlh7roqIrmga/kvobliKTmlrfmjIfku6TmmK/lkKbmiJDlip/miJbpjK/oqqRcbiAqXG4gKiBiZWNhdXNlIGdpdCBvdXRwdXQgbG9nIGhhcyBidWdcbiAqIHdoZW4gZXJyb3IgaGFwcGVuIGRpZG4ndCB0cmlnZ2VyIGNwLmVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0dpdE91dHB1dDxUIGV4dGVuZHMgU3Bhd25TeW5jUmV0dXJuczxzdHJpbmcgfCBCdWZmZXI+IHwgU3Bhd25BU3luY1JldHVybnM8c3RyaW5nIHwgQnVmZmVyPj4oY3A6IFQsIHRocm93RXJyb3I/OiBib29sZWFuLCBwcmludFN0ZGVycj86IGJvb2xlYW4pXG57XG5cdGxldCBzMTogc3RyaW5nO1xuXG5cdGlmIChjcC5lcnJvcilcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRjcC5lcnJvckNyb3NzU3Bhd24gPSBjcC5lcnJvckNyb3NzU3Bhd24gfHwgY3AuZXJyb3I7XG5cdH1cblx0ZWxzZSBpZiAoY3Auc3RkZXJyICYmIGNwLnN0ZGVyci5sZW5ndGgpXG5cdHtcblx0XHRzMSA9IFN0cmluZyhjcC5zdGRlcnIpO1xuXG5cdFx0aWYgKCFjcC5lcnJvcilcblx0XHR7XG5cdFx0XHRsZXQgczIgPSBzdHJpcEFuc2koczEpO1xuXG5cdFx0XHRpZiAoL15mYXRhbFxcOi9pbS50ZXN0KHMyKSB8fCAvXnVua25vd24gb3B0aW9uOi9pLnRlc3QoczIpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZSA9IG5ldyBFcnJvcihzMSkgYXMgSVNwYXduQVN5bmNFcnJvcjtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGUuY2hpbGQgPSBjcDtcblxuXHRcdFx0XHRjcC5lcnJvciA9IGNwLmVycm9yIHx8IGU7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0Y3AuZXJyb3JDcm9zc1NwYXduID0gY3AuZXJyb3JDcm9zc1NwYXduIHx8IGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKHRocm93RXJyb3IgJiYgY3AuZXJyb3IpXG5cdHtcblx0XHR0aHJvdyBjcC5lcnJvclxuXHR9XG5cblx0aWYgKHByaW50U3RkZXJyICYmIHMxICE9IG51bGwpXG5cdHtcblx0XHRkZWJ1Z0NvbnNvbGUuaW5mbyhgY3Auc3RkZXJyYCk7XG5cdFx0ZGVidWdDb25zb2xlLndhcm4oczEpO1xuXHR9XG5cblx0cmV0dXJuIGNwO1xufVxuXG5leHBvcnQgY29uc3Qgc3luYyA9IGNyb3NzU3Bhd25TeW5jO1xuZXhwb3J0IGNvbnN0IGFzeW5jID0gY3Jvc3NTcGF3bkFzeW5jO1xuXG5leHBvcnQgZGVmYXVsdCBleHBvcnRzIGFzIHR5cGVvZiBpbXBvcnQoJy4vZ2l0Jyk7XG4iXX0=