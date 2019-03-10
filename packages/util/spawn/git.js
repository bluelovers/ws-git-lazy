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
exports.default = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxnREFBaUQ7QUFJakQsaUNBQXFEO0FBQ3JELGdDQUErQztBQUkvQzs7R0FFRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxPQUFlLEVBQUUsSUFBcUIsRUFBRSxPQUEwQjtJQUVoRyxJQUFJLEtBQWMsQ0FBQztJQUVuQixJQUFJLE9BQU8sRUFDWDtRQUNDLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQzlCO1lBQ0MsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQTtTQUNwQjtLQUNEO0lBRUQsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWpELEtBQUssSUFBSSxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWxELGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVuQixPQUFPLEVBQUUsQ0FBQztBQUNYLENBQUM7QUFwQkQsd0NBb0JDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlLENBQUMsT0FBZSxFQUFFLElBQXFCLEVBQUUsT0FBc0I7SUFFN0YsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDckI7QUFDRixDQUFDO0FBTEQsMENBS0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWMsQ0FBaUQsRUFBSyxFQUFFLFVBQW9CLEVBQUUsV0FBcUI7SUFFaEksSUFBSSxFQUFVLENBQUM7SUFFZixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQ1o7UUFDQyxhQUFhO1FBQ2IsRUFBRSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDcEQ7U0FDSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ3RDO1FBQ0MsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQ2I7WUFDQyxJQUFJLEVBQUUsR0FBRyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXZCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQ3pEO2dCQUNDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBcUIsQ0FBQztnQkFFMUMsYUFBYTtnQkFDYixDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFFYixFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUN6QixhQUFhO2dCQUNiLEVBQUUsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7YUFDN0M7U0FDRDtLQUNEO0lBRUQsSUFBSSxVQUFVLElBQUksRUFBRSxDQUFDLEtBQUssRUFDMUI7UUFDQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUE7S0FDZDtJQUVELElBQUksV0FBVyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQzdCO1FBQ0Msa0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0Isa0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdEI7SUFFRCxPQUFPLEVBQUUsQ0FBQztBQUNYLENBQUM7QUEzQ0Qsd0NBMkNDO0FBRUQsa0JBQWUsT0FBaUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgQ3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduLWV4dHJhJyk7XG5pbXBvcnQgQmx1ZWJpcmQgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuaW1wb3J0IHsgU3Bhd25TeW5jT3B0aW9ucywgU3Bhd25PcHRpb25zIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEvdHlwZSc7XG5pbXBvcnQgeyBTcGF3bkFTeW5jUmV0dXJucywgU3Bhd25BU3luY1JldHVybnNQcm9taXNlLCBJU3Bhd25BU3luY0Vycm9yLCBTcGF3blN5bmNSZXR1cm5zLCBDcm9zc1NwYXduRXh0cmEgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS9jb3JlJztcbmltcG9ydCB7IGNyb3NzU3Bhd25PdXRwdXQsIHN0cmlwQW5zaSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBjb25zb2xlLCBkZWJ1Z0NvbnNvbGUgfSBmcm9tICcuLi9sb2cnO1xuXG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiDpgannlKjmlrwgZ2l0IOeahCBjcm9zc1NwYXduU3luY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3NTcGF3blN5bmMoY29tbWFuZDogc3RyaW5nLCBhcmdzPzogQXJyYXk8dW5rbm93bj4sIG9wdGlvbnM/OiBTcGF3blN5bmNPcHRpb25zKVxue1xuXHRsZXQgcHJpbnQ6IGJvb2xlYW47XG5cblx0aWYgKG9wdGlvbnMpXG5cdHtcblx0XHRpZiAob3B0aW9ucy5zdGRpbyA9PSAnaW5oZXJpdCcpXG5cdFx0e1xuXHRcdFx0cHJpbnQgPSB0cnVlO1xuXHRcdFx0ZGVsZXRlIG9wdGlvbnMuc3RkaW9cblx0XHR9XG5cdH1cblxuXHRsZXQgY3AgPSBDcm9zc1NwYXduLnN5bmMoY29tbWFuZCwgYXJncywgb3B0aW9ucyk7XG5cblx0cHJpbnQgJiYgY29uc29sZS5sb2coY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRjaGVja0dpdE91dHB1dChjcCk7XG5cblx0cmV0dXJuIGNwO1xufVxuXG4vKipcbiAqIOmBqeeUqOaWvCBnaXQg55qEIGNyb3NzU3Bhd25Bc3luY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3NTcGF3bkFzeW5jKGNvbW1hbmQ6IHN0cmluZywgYXJncz86IEFycmF5PHVua25vd24+LCBvcHRpb25zPzogU3Bhd25PcHRpb25zKVxue1xuXHRyZXR1cm4gQ3Jvc3NTcGF3bi5hc3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKVxuXHRcdC50aGVuKGNoZWNrR2l0T3V0cHV0KVxuXHQ7XG59XG5cbi8qKlxuICog5qqi5p+lIGdpdCDovLjlh7roqIrmga/kvobliKTmlrfmjIfku6TmmK/lkKbmiJDlip/miJbpjK/oqqRcbiAqXG4gKiBiZWNhdXNlIGdpdCBvdXRwdXQgbG9nIGhhcyBidWdcbiAqIHdoZW4gZXJyb3IgaGFwcGVuIGRpZG4ndCB0cmlnZ2VyIGNwLmVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0dpdE91dHB1dDxUIGV4dGVuZHMgU3Bhd25TeW5jUmV0dXJucyB8IFNwYXduQVN5bmNSZXR1cm5zPihjcDogVCwgdGhyb3dFcnJvcj86IGJvb2xlYW4sIHByaW50U3RkZXJyPzogYm9vbGVhbilcbntcblx0bGV0IHMxOiBzdHJpbmc7XG5cblx0aWYgKGNwLmVycm9yKVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGNwLmVycm9yQ3Jvc3NTcGF3biA9IGNwLmVycm9yQ3Jvc3NTcGF3biB8fCBjcC5lcnJvcjtcblx0fVxuXHRlbHNlIGlmIChjcC5zdGRlcnIgJiYgY3Auc3RkZXJyLmxlbmd0aClcblx0e1xuXHRcdHMxID0gU3RyaW5nKGNwLnN0ZGVycik7XG5cblx0XHRpZiAoIWNwLmVycm9yKVxuXHRcdHtcblx0XHRcdGxldCBzMiA9IHN0cmlwQW5zaShzMSk7XG5cblx0XHRcdGlmICgvXmZhdGFsXFw6L2ltLnRlc3QoczIpIHx8IC9edW5rbm93biBvcHRpb246L2kudGVzdChzMikpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKHMxKSBhcyBJU3Bhd25BU3luY0Vycm9yO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0ZS5jaGlsZCA9IGNwO1xuXG5cdFx0XHRcdGNwLmVycm9yID0gY3AuZXJyb3IgfHwgZTtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRjcC5lcnJvckNyb3NzU3Bhd24gPSBjcC5lcnJvckNyb3NzU3Bhd24gfHwgZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAodGhyb3dFcnJvciAmJiBjcC5lcnJvcilcblx0e1xuXHRcdHRocm93IGNwLmVycm9yXG5cdH1cblxuXHRpZiAocHJpbnRTdGRlcnIgJiYgczEgIT0gbnVsbClcblx0e1xuXHRcdGRlYnVnQ29uc29sZS5pbmZvKGBjcC5zdGRlcnJgKTtcblx0XHRkZWJ1Z0NvbnNvbGUud2FybihzMSk7XG5cdH1cblxuXHRyZXR1cm4gY3A7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHMgYXMgdHlwZW9mIGltcG9ydCgnLi9naXQnKTtcbiJdfQ==