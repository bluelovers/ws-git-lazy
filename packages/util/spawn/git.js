"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CrossSpawn = require("cross-spawn-extra");
const util_1 = require("./util");
const log_1 = require("../log");
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
function crossSpawnAsync(command, args, options) {
    return CrossSpawn.async(command, args, options)
        .then(checkGitOutput);
}
exports.crossSpawnAsync = crossSpawnAsync;
/**
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxnREFBaUQ7QUFJakQsaUNBQXFEO0FBQ3JELGdDQUErQztBQUkvQyxTQUFnQixjQUFjLENBQUMsT0FBZSxFQUFFLElBQXFCLEVBQUUsT0FBMEI7SUFFaEcsSUFBSSxLQUFjLENBQUM7SUFFbkIsSUFBSSxPQUFPLEVBQ1g7UUFDQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksU0FBUyxFQUM5QjtZQUNDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUE7U0FDcEI7S0FDRDtJQUVELElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVqRCxLQUFLLElBQUksYUFBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVsRCxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbkIsT0FBTyxFQUFFLENBQUM7QUFDWCxDQUFDO0FBcEJELHdDQW9CQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxPQUFlLEVBQUUsSUFBcUIsRUFBRSxPQUFzQjtJQUU3RixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7U0FDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUNyQjtBQUNGLENBQUM7QUFMRCwwQ0FLQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLGNBQWMsQ0FBaUQsRUFBSyxFQUFFLFVBQW9CLEVBQUUsV0FBcUI7SUFFaEksSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNqQztRQUNDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsSUFBSSxFQUFFLEdBQUcsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUN6RDtZQUNDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXRCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDekIsYUFBYTtZQUNiLEVBQUUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLElBQUksVUFBVSxFQUNkO2dCQUNDLE1BQU0sQ0FBQyxDQUFBO2FBQ1A7U0FDRDtRQUVELElBQUksV0FBVyxFQUNmO1lBQ0Msa0JBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0Isa0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEI7S0FDRDtJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQTdCRCx3Q0E2QkM7QUFFRCxrQkFBZSxPQUFpQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCBDcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBCbHVlYmlyZCA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgeyBTcGF3blN5bmNPcHRpb25zLCBTcGF3bk9wdGlvbnMgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS90eXBlJztcbmltcG9ydCB7IFNwYXduQVN5bmNSZXR1cm5zLCBTcGF3bkFTeW5jUmV0dXJuc1Byb21pc2UsIElTcGF3bkFTeW5jRXJyb3IsIFNwYXduU3luY1JldHVybnMsIENyb3NzU3Bhd25FeHRyYSB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhL2NvcmUnO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCwgc3RyaXBBbnNpIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IGNvbnNvbGUsIGRlYnVnQ29uc29sZSB9IGZyb20gJy4uL2xvZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3NTcGF3blN5bmMoY29tbWFuZDogc3RyaW5nLCBhcmdzPzogQXJyYXk8dW5rbm93bj4sIG9wdGlvbnM/OiBTcGF3blN5bmNPcHRpb25zKVxue1xuXHRsZXQgcHJpbnQ6IGJvb2xlYW47XG5cblx0aWYgKG9wdGlvbnMpXG5cdHtcblx0XHRpZiAob3B0aW9ucy5zdGRpbyA9PSAnaW5oZXJpdCcpXG5cdFx0e1xuXHRcdFx0cHJpbnQgPSB0cnVlO1xuXHRcdFx0ZGVsZXRlIG9wdGlvbnMuc3RkaW9cblx0XHR9XG5cdH1cblxuXHRsZXQgY3AgPSBDcm9zc1NwYXduLnN5bmMoY29tbWFuZCwgYXJncywgb3B0aW9ucyk7XG5cblx0cHJpbnQgJiYgY29uc29sZS5sb2coY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRjaGVja0dpdE91dHB1dChjcCk7XG5cblx0cmV0dXJuIGNwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3NTcGF3bkFzeW5jKGNvbW1hbmQ6IHN0cmluZywgYXJncz86IEFycmF5PHVua25vd24+LCBvcHRpb25zPzogU3Bhd25PcHRpb25zKVxue1xuXHRyZXR1cm4gQ3Jvc3NTcGF3bi5hc3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKVxuXHRcdC50aGVuKGNoZWNrR2l0T3V0cHV0KVxuXHQ7XG59XG5cbi8qKlxuICogYmVjYXVzZSBnaXQgb3V0cHV0IGxvZyBoYXMgYnVnXG4gKiB3aGVuIGVycm9yIGhhcHBlbiBkaWRuJ3QgdHJpZ2dlciBjcC5lcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tHaXRPdXRwdXQ8VCBleHRlbmRzIFNwYXduU3luY1JldHVybnMgfCBTcGF3bkFTeW5jUmV0dXJucz4oY3A6IFQsIHRocm93RXJyb3I/OiBib29sZWFuLCBwcmludFN0ZGVycj86IGJvb2xlYW4pXG57XG5cdGlmIChjcC5zdGRlcnIgJiYgY3Auc3RkZXJyLmxlbmd0aClcblx0e1xuXHRcdGxldCBzMSA9IFN0cmluZyhjcC5zdGRlcnIpO1xuXHRcdGxldCBzMiA9IHN0cmlwQW5zaShzMSk7XG5cblx0XHRpZiAoL15mYXRhbFxcOi9pbS50ZXN0KHMyKSB8fCAvXnVua25vd24gb3B0aW9uOi9pLnRlc3QoczIpKVxuXHRcdHtcblx0XHRcdGxldCBlID0gbmV3IEVycm9yKHMxKTtcblxuXHRcdFx0Y3AuZXJyb3IgPSBjcC5lcnJvciB8fCBlO1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y3AuZXJyb3JDcm9zc1NwYXduID0gZTtcblxuXHRcdFx0aWYgKHRocm93RXJyb3IpXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93IGVcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAocHJpbnRTdGRlcnIpXG5cdFx0e1xuXHRcdFx0ZGVidWdDb25zb2xlLmluZm8oYGNwLnN0ZGVycmApO1xuXHRcdFx0ZGVidWdDb25zb2xlLndhcm4oczEpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjcDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0cyBhcyB0eXBlb2YgaW1wb3J0KCcuL2dpdCcpO1xuIl19