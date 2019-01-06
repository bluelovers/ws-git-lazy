"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./lib/type");
exports.defaultOptions = type_1.defaultOptions;
exports.EnumGitDateFormat = type_1.EnumGitDateFormat;
exports.defaultFields = type_1.defaultFields;
const util_1 = require("./lib/util");
const Bluebird = require("bluebird");
const crossSpawn = require("cross-spawn-extra");
function gitlog(options, cb) {
    options = util_1.handleOptions(options);
    let { bin, commands } = util_1.buildCommands(options);
    if (!cb) {
        // run Sync
        return util_1.parseCommitsStdout(options, crossSpawn.sync(bin, commands, options.execOptions).stdout);
    }
    return crossSpawn.async(bin, commands, options.execOptions)
        .then(function (child) {
        let { stdout, stderr, error } = child;
        let commits = util_1.parseCommitsStdout(options, stdout);
        let err = stderr && stderr.toString() || error || null;
        if (err) {
            let e = util_1.createError(err, {
                bin,
                commands,
                child,
                commits,
            });
            return Bluebird.reject(err)
                .tapCatch(function () {
                return cb(e, commits);
            });
        }
        else {
            return Bluebird.resolve(commits)
                .tap(function () {
                return cb(null, commits);
            });
        }
    });
}
exports.gitlog = gitlog;
(function (gitlog) {
    /**
     * this method can make sure u are use sync mode
     */
    function sync(options) {
        return gitlog(options);
    }
    gitlog.sync = sync;
    /**
     * allow `await` when use `callback` mode,
     * but remember u can't change `return value` when use `callback`
     */
    function asyncCallback(options, cb) {
        if (typeof cb !== 'function') {
            throw new TypeError(`expected cb as function`);
        }
        // @ts-ignore
        return gitlog(options, cb);
    }
    gitlog.asyncCallback = asyncCallback;
    /**
     * async Promise mode
     */
    function async(options) {
        return gitlog(options, dummy);
        /*
        return new Bluebird<IReturnCommits>(function (resolve, reject)
        {
            gitlog(options, function (error, commits)
            {
                if (error)
                {
                    reject(error)
                }
                else
                {
                    resolve(commits)
                }
            })
        });
        */
    }
    gitlog.async = async;
    /**
     * for trigger async Promise mode
     */
    function dummy() { }
})(gitlog = exports.gitlog || (exports.gitlog = {}));
exports.sync = gitlog.sync;
exports.asyncCallback = gitlog.asyncCallback;
exports.async = gitlog.async;
gitlog.gitlog = gitlog;
gitlog.default = gitlog;
exports.default = gitlog;
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQVVvQjtBQWNtRSx5QkF2QnRGLHFCQUFjLENBdUJzRjtBQUE1Riw0QkF0QlIsd0JBQWlCLENBc0JRO0FBQThDLHdCQWZ2RSxvQkFBYSxDQWV1RTtBQWJyRixxQ0FRb0I7QUFDcEIscUNBQXNDO0FBQ3RDLGdEQUFpRDtBQVNqRCxTQUFnQixNQUFNLENBQUMsT0FBaUIsRUFBRSxFQUFtQjtJQUU1RCxPQUFPLEdBQUcsb0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLG9CQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDLEVBQUUsRUFDUDtRQUNDLFdBQVc7UUFDWCxPQUFPLHlCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzlGO0lBRUQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUN6RCxJQUFJLENBQUMsVUFBVSxLQUFLO1FBRXBCLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQztRQUV0QyxJQUFJLE9BQU8sR0FBRyx5QkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDO1FBRXZELElBQUksR0FBRyxFQUNQO1lBQ0MsSUFBSSxDQUFDLEdBQUcsa0JBQVcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hCLEdBQUc7Z0JBQ0gsUUFBUTtnQkFDUixLQUFLO2dCQUNMLE9BQU87YUFDUCxDQUFDLENBQUM7WUFFSCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUN6QixRQUFRLENBQUM7Z0JBRVQsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3RCLENBQUMsQ0FBQyxDQUNEO1NBQ0Y7YUFFRDtZQUNDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7aUJBQzlCLEdBQUcsQ0FBQztnQkFFSixPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLENBQUE7U0FDSDtJQUNGLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQTlDRCx3QkE4Q0M7QUFFRCxXQUFpQixNQUFNO0lBRXRCOztPQUVHO0lBQ0gsU0FBZ0IsSUFBSSxDQUFDLE9BQWlCO1FBRXJDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFIZSxXQUFJLE9BR25CLENBQUE7SUFFRDs7O09BR0c7SUFDSCxTQUFnQixhQUFhLENBQUMsT0FBaUIsRUFBRSxFQUFrQjtRQUVsRSxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFDNUI7WUFDQyxNQUFNLElBQUksU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDL0M7UUFFRCxhQUFhO1FBQ2IsT0FBTyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFUZSxvQkFBYSxnQkFTNUIsQ0FBQTtJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsS0FBSyxDQUFDLE9BQWlCO1FBRXRDLE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5Qjs7Ozs7Ozs7Ozs7Ozs7O1VBZUU7SUFDSCxDQUFDO0lBcEJlLFlBQUssUUFvQnBCLENBQUE7SUFFRDs7T0FFRztJQUNILFNBQVMsS0FBSyxLQUFJLENBQUM7QUFDcEIsQ0FBQyxFQXREZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBc0R0QjtBQUVhLFFBQUEsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDbkIsUUFBQSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUNyQyxRQUFBLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBRW5DLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBRXhCLGtCQUFlLE1BQU0sQ0FBQTtBQUVyQixhQUFhO0FBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQge1xuXHRkZWZhdWx0T3B0aW9ucyxcblx0RW51bUdpdERhdGVGb3JtYXQsXG5cdGZpZWxkcyxcblx0SU9wdGlvbnMsIElPcHRpb25zR2l0RmxvZ3MsIElPcHRpb25zR2l0V2l0aFZhbHVlLCBJT3B0aW9uc0dpdEZsb2dzRXh0cmEsXG5cdElQYXJzZUNvbW1pdCxcblx0SVJldHVybkNvbW1pdHMsXG5cdElGaWVsZHNBcnJheSxcblx0SUNvbW1hbmRzLCBub3RPcHRGaWVsZHMsIGRlbGltaXRlcixcblx0ZGVmYXVsdEZpZWxkcyxcbn0gZnJvbSAnLi9saWIvdHlwZSc7XG5pbXBvcnQge1xuXHRhZGRPcHRpb25hbCxcblx0ZGVidWcsXG5cdElBc3luY0NhbGxiYWNrLFxuXHRwYXJzZUNvbW1pdHMsXG5cdHBhcnNlQ29tbWl0c1N0ZG91dCxcblx0aGFuZGxlT3B0aW9ucyxcblx0YnVpbGRDb21tYW5kcywgY3JlYXRlRXJyb3IsXG59IGZyb20gJy4vbGliL3V0aWwnO1xuaW1wb3J0IEJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBleHRlbmQgPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG5cbmV4cG9ydCB7IEVudW1HaXREYXRlRm9ybWF0LCBJUmV0dXJuQ29tbWl0cywgSVBhcnNlQ29tbWl0LCBJRmllbGRzQXJyYXksIGRlZmF1bHRGaWVsZHMsIGRlZmF1bHRPcHRpb25zIH1cbmV4cG9ydCB7IElPcHRpb25zLCBJT3B0aW9uc0dpdEZsb2dzLCBJT3B0aW9uc0dpdFdpdGhWYWx1ZSwgSU9wdGlvbnNHaXRGbG9nc0V4dHJhLCB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnaXRsb2cob3B0aW9uczogSU9wdGlvbnMpOiBJUGFyc2VDb21taXRbXVxuZXhwb3J0IGZ1bmN0aW9uIGdpdGxvZyhvcHRpb25zOiBJT3B0aW9ucywgY2I6IElBc3luY0NhbGxiYWNrKTogQmx1ZWJpcmQ8SVBhcnNlQ29tbWl0W10+XG5leHBvcnQgZnVuY3Rpb24gZ2l0bG9nKG9wdGlvbnM6IElPcHRpb25zLCBjYj86IElBc3luY0NhbGxiYWNrKTogSVBhcnNlQ29tbWl0W10gfCBCbHVlYmlyZDxJUGFyc2VDb21taXRbXT5cbmV4cG9ydCBmdW5jdGlvbiBnaXRsb2cob3B0aW9uczogSU9wdGlvbnMsIGNiPzogSUFzeW5jQ2FsbGJhY2spOiBJUGFyc2VDb21taXRbXSB8IEJsdWViaXJkPElQYXJzZUNvbW1pdFtdPlxue1xuXHRvcHRpb25zID0gaGFuZGxlT3B0aW9ucyhvcHRpb25zKTtcblx0bGV0IHsgYmluLCBjb21tYW5kcyB9ID0gYnVpbGRDb21tYW5kcyhvcHRpb25zKTtcblxuXHRpZiAoIWNiKVxuXHR7XG5cdFx0Ly8gcnVuIFN5bmNcblx0XHRyZXR1cm4gcGFyc2VDb21taXRzU3Rkb3V0KG9wdGlvbnMsIGNyb3NzU3Bhd24uc3luYyhiaW4sIGNvbW1hbmRzLCBvcHRpb25zLmV4ZWNPcHRpb25zKS5zdGRvdXQpXG5cdH1cblxuXHRyZXR1cm4gY3Jvc3NTcGF3bi5hc3luYyhiaW4sIGNvbW1hbmRzLCBvcHRpb25zLmV4ZWNPcHRpb25zKVxuXHRcdC50aGVuKGZ1bmN0aW9uIChjaGlsZClcblx0XHR7XG5cdFx0XHRsZXQgeyBzdGRvdXQsIHN0ZGVyciwgZXJyb3IgfSA9IGNoaWxkO1xuXG5cdFx0XHRsZXQgY29tbWl0cyA9IHBhcnNlQ29tbWl0c1N0ZG91dChvcHRpb25zLCBzdGRvdXQpO1xuXG5cdFx0XHRsZXQgZXJyID0gc3RkZXJyICYmIHN0ZGVyci50b1N0cmluZygpIHx8IGVycm9yIHx8IG51bGw7XG5cblx0XHRcdGlmIChlcnIpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBlID0gY3JlYXRlRXJyb3IoZXJyLCB7XG5cdFx0XHRcdFx0YmluLFxuXHRcdFx0XHRcdGNvbW1hbmRzLFxuXHRcdFx0XHRcdGNoaWxkLFxuXHRcdFx0XHRcdGNvbW1pdHMsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZWplY3QoZXJyKVxuXHRcdFx0XHRcdC50YXBDYXRjaChmdW5jdGlvbiAoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBjYihlLCBjb21taXRzKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShjb21taXRzKVxuXHRcdFx0XHRcdC50YXAoZnVuY3Rpb24gKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2IobnVsbCwgY29tbWl0cylcblx0XHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIGdpdGxvZ1xue1xuXHQvKipcblx0ICogdGhpcyBtZXRob2QgY2FuIG1ha2Ugc3VyZSB1IGFyZSB1c2Ugc3luYyBtb2RlXG5cdCAqL1xuXHRleHBvcnQgZnVuY3Rpb24gc3luYyhvcHRpb25zOiBJT3B0aW9ucylcblx0e1xuXHRcdHJldHVybiBnaXRsb2cob3B0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogYWxsb3cgYGF3YWl0YCB3aGVuIHVzZSBgY2FsbGJhY2tgIG1vZGUsXG5cdCAqIGJ1dCByZW1lbWJlciB1IGNhbid0IGNoYW5nZSBgcmV0dXJuIHZhbHVlYCB3aGVuIHVzZSBgY2FsbGJhY2tgXG5cdCAqL1xuXHRleHBvcnQgZnVuY3Rpb24gYXN5bmNDYWxsYmFjayhvcHRpb25zOiBJT3B0aW9ucywgY2I6IElBc3luY0NhbGxiYWNrKVxuXHR7XG5cdFx0aWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBleHBlY3RlZCBjYiBhcyBmdW5jdGlvbmApO1xuXHRcdH1cblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gZ2l0bG9nKG9wdGlvbnMsIGNiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBhc3luYyBQcm9taXNlIG1vZGVcblx0ICovXG5cdGV4cG9ydCBmdW5jdGlvbiBhc3luYyhvcHRpb25zOiBJT3B0aW9ucylcblx0e1xuXHRcdHJldHVybiBnaXRsb2cob3B0aW9ucywgZHVtbXkpO1xuXG5cdFx0Lypcblx0XHRyZXR1cm4gbmV3IEJsdWViaXJkPElSZXR1cm5Db21taXRzPihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdHtcblx0XHRcdGdpdGxvZyhvcHRpb25zLCBmdW5jdGlvbiAoZXJyb3IsIGNvbW1pdHMpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChlcnJvcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlamVjdChlcnJvcilcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXNvbHZlKGNvbW1pdHMpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSk7XG5cdFx0Ki9cblx0fVxuXG5cdC8qKlxuXHQgKiBmb3IgdHJpZ2dlciBhc3luYyBQcm9taXNlIG1vZGVcblx0ICovXG5cdGZ1bmN0aW9uIGR1bW15KCkge31cbn1cblxuZXhwb3J0IGltcG9ydCBzeW5jID0gZ2l0bG9nLnN5bmM7XG5leHBvcnQgaW1wb3J0IGFzeW5jQ2FsbGJhY2sgPSBnaXRsb2cuYXN5bmNDYWxsYmFjaztcbmV4cG9ydCBpbXBvcnQgYXN5bmMgPSBnaXRsb2cuYXN5bmM7XG5cbmdpdGxvZy5naXRsb2cgPSBnaXRsb2c7XG5naXRsb2cuZGVmYXVsdCA9IGdpdGxvZztcblxuZXhwb3J0IGRlZmF1bHQgZ2l0bG9nXG5cbi8vIEB0cy1pZ25vcmVcbk9iamVjdC5mcmVlemUoZXhwb3J0cyk7XG4iXX0=