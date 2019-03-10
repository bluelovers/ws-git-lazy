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
    if (cp.stderr && cp.stderr.length) {
        let s1 = String(cp.stderr);
        let s2 = util_1.stripAnsi(s1);
        if (/^fatal\:/im.test(s2) || /^unknown option:/i.test(s2)) {
            let e = new Error(s1);
            cp.error = cp.error || e;
            // @ts-ignore
            cp.errorCrossSpawn = e;
            if (throwError) {
                throw e;
            }
        }
        if (printStderr) {
            log_1.debugConsole.info(`cp.stderr`);
            log_1.debugConsole.warn(s1);
        }
    }
    return cp;
}
exports.checkGitOutput = checkGitOutput;
exports.default = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxnREFBaUQ7QUFJakQsaUNBQXFEO0FBQ3JELGdDQUErQztBQUkvQzs7R0FFRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxPQUFlLEVBQUUsSUFBcUIsRUFBRSxPQUEwQjtJQUVoRyxJQUFJLEtBQWMsQ0FBQztJQUVuQixJQUFJLE9BQU8sRUFDWDtRQUNDLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQzlCO1lBQ0MsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQTtTQUNwQjtLQUNEO0lBRUQsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWpELEtBQUssSUFBSSxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWxELGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVuQixPQUFPLEVBQUUsQ0FBQztBQUNYLENBQUM7QUFwQkQsd0NBb0JDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlLENBQUMsT0FBZSxFQUFFLElBQXFCLEVBQUUsT0FBc0I7SUFFN0YsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDckI7QUFDRixDQUFDO0FBTEQsMENBS0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWMsQ0FBaUQsRUFBSyxFQUFFLFVBQW9CLEVBQUUsV0FBcUI7SUFFaEksSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNqQztRQUNDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsSUFBSSxFQUFFLEdBQUcsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUN6RDtZQUNDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXRCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDekIsYUFBYTtZQUNiLEVBQUUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLElBQUksVUFBVSxFQUNkO2dCQUNDLE1BQU0sQ0FBQyxDQUFBO2FBQ1A7U0FDRDtRQUVELElBQUksV0FBVyxFQUNmO1lBQ0Msa0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0Isa0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEI7S0FDRDtJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQTdCRCx3Q0E2QkM7QUFFRCxrQkFBZSxPQUFpQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCBDcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBCbHVlYmlyZCA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgeyBTcGF3blN5bmNPcHRpb25zLCBTcGF3bk9wdGlvbnMgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS90eXBlJztcbmltcG9ydCB7IFNwYXduQVN5bmNSZXR1cm5zLCBTcGF3bkFTeW5jUmV0dXJuc1Byb21pc2UsIElTcGF3bkFTeW5jRXJyb3IsIFNwYXduU3luY1JldHVybnMsIENyb3NzU3Bhd25FeHRyYSB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhL2NvcmUnO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCwgc3RyaXBBbnNpIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IGNvbnNvbGUsIGRlYnVnQ29uc29sZSB9IGZyb20gJy4uL2xvZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIOmBqeeUqOaWvCBnaXQg55qEIGNyb3NzU3Bhd25TeW5jXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NwYXduU3luYyhjb21tYW5kOiBzdHJpbmcsIGFyZ3M/OiBBcnJheTx1bmtub3duPiwgb3B0aW9ucz86IFNwYXduU3luY09wdGlvbnMpXG57XG5cdGxldCBwcmludDogYm9vbGVhbjtcblxuXHRpZiAob3B0aW9ucylcblx0e1xuXHRcdGlmIChvcHRpb25zLnN0ZGlvID09ICdpbmhlcml0Jylcblx0XHR7XG5cdFx0XHRwcmludCA9IHRydWU7XG5cdFx0XHRkZWxldGUgb3B0aW9ucy5zdGRpb1xuXHRcdH1cblx0fVxuXG5cdGxldCBjcCA9IENyb3NzU3Bhd24uc3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKTtcblxuXHRwcmludCAmJiBjb25zb2xlLmxvZyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdGNoZWNrR2l0T3V0cHV0KGNwKTtcblxuXHRyZXR1cm4gY3A7XG59XG5cbi8qKlxuICog6YGp55So5pa8IGdpdCDnmoQgY3Jvc3NTcGF3bkFzeW5jXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NwYXduQXN5bmMoY29tbWFuZDogc3RyaW5nLCBhcmdzPzogQXJyYXk8dW5rbm93bj4sIG9wdGlvbnM/OiBTcGF3bk9wdGlvbnMpXG57XG5cdHJldHVybiBDcm9zc1NwYXduLmFzeW5jKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpXG5cdFx0LnRoZW4oY2hlY2tHaXRPdXRwdXQpXG5cdDtcbn1cblxuLyoqXG4gKiDmqqLmn6UgZ2l0IOi8uOWHuuioiuaBr+S+huWIpOaWt+aMh+S7pOaYr+WQpuaIkOWKn+aIlumMr+iqpFxuICpcbiAqIGJlY2F1c2UgZ2l0IG91dHB1dCBsb2cgaGFzIGJ1Z1xuICogd2hlbiBlcnJvciBoYXBwZW4gZGlkbid0IHRyaWdnZXIgY3AuZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrR2l0T3V0cHV0PFQgZXh0ZW5kcyBTcGF3blN5bmNSZXR1cm5zIHwgU3Bhd25BU3luY1JldHVybnM+KGNwOiBULCB0aHJvd0Vycm9yPzogYm9vbGVhbiwgcHJpbnRTdGRlcnI/OiBib29sZWFuKVxue1xuXHRpZiAoY3Auc3RkZXJyICYmIGNwLnN0ZGVyci5sZW5ndGgpXG5cdHtcblx0XHRsZXQgczEgPSBTdHJpbmcoY3Auc3RkZXJyKTtcblx0XHRsZXQgczIgPSBzdHJpcEFuc2koczEpO1xuXG5cdFx0aWYgKC9eZmF0YWxcXDovaW0udGVzdChzMikgfHwgL151bmtub3duIG9wdGlvbjovaS50ZXN0KHMyKSlcblx0XHR7XG5cdFx0XHRsZXQgZSA9IG5ldyBFcnJvcihzMSk7XG5cblx0XHRcdGNwLmVycm9yID0gY3AuZXJyb3IgfHwgZTtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNwLmVycm9yQ3Jvc3NTcGF3biA9IGU7XG5cblx0XHRcdGlmICh0aHJvd0Vycm9yKVxuXHRcdFx0e1xuXHRcdFx0XHR0aHJvdyBlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHByaW50U3RkZXJyKVxuXHRcdHtcblx0XHRcdGRlYnVnQ29uc29sZS5pbmZvKGBjcC5zdGRlcnJgKTtcblx0XHRcdGRlYnVnQ29uc29sZS53YXJuKHMxKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY3A7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHMgYXMgdHlwZW9mIGltcG9ydCgnLi9naXQnKTtcbiJdfQ==