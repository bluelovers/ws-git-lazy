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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxnREFBaUQ7QUFJakQsaUNBQXFEO0FBQ3JELGdDQUErQztBQUkvQzs7R0FFRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxPQUFlLEVBQUUsSUFBcUIsRUFBRSxPQUEwQjtJQUVoRyxJQUFJLEtBQWMsQ0FBQztJQUVuQixJQUFJLE9BQU8sRUFDWDtRQUNDLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQzlCO1lBQ0MsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQTtTQUNwQjtLQUNEO0lBRUQsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWpELEtBQUssSUFBSSxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWxELGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVuQixPQUFPLEVBQUUsQ0FBQztBQUNYLENBQUM7QUFwQkQsd0NBb0JDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlLENBQUMsT0FBZSxFQUFFLElBQXFCLEVBQUUsT0FBc0I7SUFFN0YsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDckI7QUFDRixDQUFDO0FBTEQsMENBS0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWMsQ0FBaUQsRUFBSyxFQUFFLFVBQW9CLEVBQUUsV0FBcUI7SUFFaEksSUFBSSxFQUFVLENBQUM7SUFFZixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQ1o7UUFDQyxhQUFhO1FBQ2IsRUFBRSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDcEQ7U0FDSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ3RDO1FBQ0MsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQ2I7WUFDQyxJQUFJLEVBQUUsR0FBRyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXZCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQ3pEO2dCQUNDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBcUIsQ0FBQztnQkFFMUMsYUFBYTtnQkFDYixDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFFYixFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUN6QixhQUFhO2dCQUNiLEVBQUUsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7YUFDN0M7U0FDRDtLQUNEO0lBRUQsSUFBSSxVQUFVLElBQUksRUFBRSxDQUFDLEtBQUssRUFDMUI7UUFDQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUE7S0FDZDtJQUVELElBQUksV0FBVyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQzdCO1FBQ0Msa0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0Isa0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdEI7SUFFRCxPQUFPLEVBQUUsQ0FBQztBQUNYLENBQUM7QUEzQ0Qsd0NBMkNDO0FBRVksUUFBQSxJQUFJLEdBQUcsY0FBYyxDQUFDO0FBQ3RCLFFBQUEsS0FBSyxHQUFHLGVBQWUsQ0FBQztBQUVyQyxrQkFBZSxPQUFpQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCBDcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBCbHVlYmlyZCA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgeyBTcGF3blN5bmNPcHRpb25zLCBTcGF3bk9wdGlvbnMgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS90eXBlJztcbmltcG9ydCB7IFNwYXduQVN5bmNSZXR1cm5zLCBTcGF3bkFTeW5jUmV0dXJuc1Byb21pc2UsIElTcGF3bkFTeW5jRXJyb3IsIFNwYXduU3luY1JldHVybnMsIENyb3NzU3Bhd25FeHRyYSB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhL2NvcmUnO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCwgc3RyaXBBbnNpIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IGNvbnNvbGUsIGRlYnVnQ29uc29sZSB9IGZyb20gJy4uL2xvZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIOmBqeeUqOaWvCBnaXQg55qEIGNyb3NzU3Bhd25TeW5jXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NwYXduU3luYyhjb21tYW5kOiBzdHJpbmcsIGFyZ3M/OiBBcnJheTx1bmtub3duPiwgb3B0aW9ucz86IFNwYXduU3luY09wdGlvbnMpXG57XG5cdGxldCBwcmludDogYm9vbGVhbjtcblxuXHRpZiAob3B0aW9ucylcblx0e1xuXHRcdGlmIChvcHRpb25zLnN0ZGlvID09ICdpbmhlcml0Jylcblx0XHR7XG5cdFx0XHRwcmludCA9IHRydWU7XG5cdFx0XHRkZWxldGUgb3B0aW9ucy5zdGRpb1xuXHRcdH1cblx0fVxuXG5cdGxldCBjcCA9IENyb3NzU3Bhd24uc3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKTtcblxuXHRwcmludCAmJiBjb25zb2xlLmxvZyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdGNoZWNrR2l0T3V0cHV0KGNwKTtcblxuXHRyZXR1cm4gY3A7XG59XG5cbi8qKlxuICog6YGp55So5pa8IGdpdCDnmoQgY3Jvc3NTcGF3bkFzeW5jXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NwYXduQXN5bmMoY29tbWFuZDogc3RyaW5nLCBhcmdzPzogQXJyYXk8dW5rbm93bj4sIG9wdGlvbnM/OiBTcGF3bk9wdGlvbnMpXG57XG5cdHJldHVybiBDcm9zc1NwYXduLmFzeW5jKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpXG5cdFx0LnRoZW4oY2hlY2tHaXRPdXRwdXQpXG5cdDtcbn1cblxuLyoqXG4gKiDmqqLmn6UgZ2l0IOi8uOWHuuioiuaBr+S+huWIpOaWt+aMh+S7pOaYr+WQpuaIkOWKn+aIlumMr+iqpFxuICpcbiAqIGJlY2F1c2UgZ2l0IG91dHB1dCBsb2cgaGFzIGJ1Z1xuICogd2hlbiBlcnJvciBoYXBwZW4gZGlkbid0IHRyaWdnZXIgY3AuZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrR2l0T3V0cHV0PFQgZXh0ZW5kcyBTcGF3blN5bmNSZXR1cm5zIHwgU3Bhd25BU3luY1JldHVybnM+KGNwOiBULCB0aHJvd0Vycm9yPzogYm9vbGVhbiwgcHJpbnRTdGRlcnI/OiBib29sZWFuKVxue1xuXHRsZXQgczE6IHN0cmluZztcblxuXHRpZiAoY3AuZXJyb3IpXG5cdHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0Y3AuZXJyb3JDcm9zc1NwYXduID0gY3AuZXJyb3JDcm9zc1NwYXduIHx8IGNwLmVycm9yO1xuXHR9XG5cdGVsc2UgaWYgKGNwLnN0ZGVyciAmJiBjcC5zdGRlcnIubGVuZ3RoKVxuXHR7XG5cdFx0czEgPSBTdHJpbmcoY3Auc3RkZXJyKTtcblxuXHRcdGlmICghY3AuZXJyb3IpXG5cdFx0e1xuXHRcdFx0bGV0IHMyID0gc3RyaXBBbnNpKHMxKTtcblxuXHRcdFx0aWYgKC9eZmF0YWxcXDovaW0udGVzdChzMikgfHwgL151bmtub3duIG9wdGlvbjovaS50ZXN0KHMyKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IGUgPSBuZXcgRXJyb3IoczEpIGFzIElTcGF3bkFTeW5jRXJyb3I7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRlLmNoaWxkID0gY3A7XG5cblx0XHRcdFx0Y3AuZXJyb3IgPSBjcC5lcnJvciB8fCBlO1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGNwLmVycm9yQ3Jvc3NTcGF3biA9IGNwLmVycm9yQ3Jvc3NTcGF3biB8fCBlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICh0aHJvd0Vycm9yICYmIGNwLmVycm9yKVxuXHR7XG5cdFx0dGhyb3cgY3AuZXJyb3Jcblx0fVxuXG5cdGlmIChwcmludFN0ZGVyciAmJiBzMSAhPSBudWxsKVxuXHR7XG5cdFx0ZGVidWdDb25zb2xlLmluZm8oYGNwLnN0ZGVycmApO1xuXHRcdGRlYnVnQ29uc29sZS53YXJuKHMxKTtcblx0fVxuXG5cdHJldHVybiBjcDtcbn1cblxuZXhwb3J0IGNvbnN0IHN5bmMgPSBjcm9zc1NwYXduU3luYztcbmV4cG9ydCBjb25zdCBhc3luYyA9IGNyb3NzU3Bhd25Bc3luYztcblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0cyBhcyB0eXBlb2YgaW1wb3J0KCcuL2dpdCcpO1xuIl19