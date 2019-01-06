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
        let err = stderr && stderr.toString() || error;
        if (err) {
            return Bluebird.reject(err)
                .tapCatch(function () {
                return cb(err, commits);
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
    function sync(options) {
        return gitlog(options);
    }
    gitlog.sync = sync;
    function asyncCallback(options, cb) {
        if (typeof cb !== 'function') {
            throw new TypeError();
        }
        // @ts-ignore
        return gitlog(options, cb);
    }
    gitlog.asyncCallback = asyncCallback;
    function async(options) {
        return new Promise(function (resolve, reject) {
            gitlog(options, function (error, commits) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(commits);
                }
            });
        });
    }
    gitlog.async = async;
})(gitlog = exports.gitlog || (exports.gitlog = {}));
exports.sync = gitlog.sync;
exports.asyncCallback = gitlog.asyncCallback;
exports.async = gitlog.async;
gitlog.gitlog = gitlog;
gitlog.default = gitlog;
exports.default = gitlog;
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQVVvQjtBQWM2RSx5QkF2QmhHLHFCQUFjLENBdUJnRztBQUF0Ryw0QkF0QlIsd0JBQWlCLENBc0JRO0FBQXdELHdCQWZqRixvQkFBYSxDQWVpRjtBQWIvRixxQ0FRb0I7QUFDcEIscUNBQXNDO0FBQ3RDLGdEQUFpRDtBQUtqRCxTQUFnQixNQUFNLENBQUMsT0FBaUIsRUFBRSxFQUFtQjtJQUU1RCxPQUFPLEdBQUcsb0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLG9CQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDLEVBQUUsRUFDUDtRQUNDLFdBQVc7UUFDWCxPQUFPLHlCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzlGO0lBRUQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUN6RCxJQUFJLENBQUMsVUFBVSxLQUFLO1FBRXBCLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQztRQUV0QyxJQUFJLE9BQU8sR0FBRyx5QkFBa0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxLQUFLLENBQUM7UUFFL0MsSUFBSSxHQUFHLEVBQ1A7WUFDQyxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUN6QixRQUFRLENBQUM7Z0JBRVQsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3hCLENBQUMsQ0FBQyxDQUNEO1NBQ0Y7YUFFRDtZQUNDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7aUJBQzlCLEdBQUcsQ0FBQztnQkFFSixPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLENBQUE7U0FDSDtJQUNGLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQXZDRCx3QkF1Q0M7QUFJRCxXQUFpQixNQUFNO0lBRXRCLFNBQWdCLElBQUksQ0FBQyxPQUFpQjtRQUVyQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBSGUsV0FBSSxPQUduQixDQUFBO0lBRUQsU0FBZ0IsYUFBYSxDQUFDLE9BQWlCLEVBQUUsRUFBa0I7UUFFbEUsSUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQzVCO1lBQ0MsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1NBQ3RCO1FBRUQsYUFBYTtRQUNiLE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBVGUsb0JBQWEsZ0JBUzVCLENBQUE7SUFFRCxTQUFnQixLQUFLLENBQUMsT0FBaUI7UUFFdEMsT0FBTyxJQUFJLE9BQU8sQ0FBa0MsVUFBVSxPQUFPLEVBQUUsTUFBTTtZQUU1RSxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFLE9BQU87Z0JBRXZDLElBQUksS0FBSyxFQUNUO29CQUNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDYjtxQkFFRDtvQkFDQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7aUJBQ2hCO1lBQ0YsQ0FBQyxDQUFDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFoQmUsWUFBSyxRQWdCcEIsQ0FBQTtBQUNGLENBQUMsRUFuQ2dCLE1BQU0sR0FBTixjQUFNLEtBQU4sY0FBTSxRQW1DdEI7QUFFYSxRQUFBLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ25CLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDckMsUUFBQSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUVuQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN2QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUV4QixrQkFBZSxNQUFNLENBQUE7QUFFckIsYUFBYTtBQUNiLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHtcblx0ZGVmYXVsdE9wdGlvbnMsXG5cdEVudW1HaXREYXRlRm9ybWF0LFxuXHRmaWVsZHMsXG5cdElPcHRpb25zLFxuXHRJUGFyc2VDb21taXQsXG5cdElSZXR1cm5Db21taXRzLFxuXHRJRmllbGRzQXJyYXksXG5cdElDb21tYW5kcywgbm90T3B0RmllbGRzLCBkZWxpbWl0ZXIsXG5cdGRlZmF1bHRGaWVsZHMsXG59IGZyb20gJy4vbGliL3R5cGUnO1xuaW1wb3J0IHtcblx0YWRkT3B0aW9uYWwsXG5cdGRlYnVnLFxuXHRJQXN5bmNDYWxsYmFjayxcblx0cGFyc2VDb21taXRzLFxuXHRwYXJzZUNvbW1pdHNTdGRvdXQsXG5cdGhhbmRsZU9wdGlvbnMsXG5cdGJ1aWxkQ29tbWFuZHMsXG59IGZyb20gJy4vbGliL3V0aWwnO1xuaW1wb3J0IEJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBleHRlbmQgPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyk7XG5cbmV4cG9ydCB7IEVudW1HaXREYXRlRm9ybWF0LCBJUmV0dXJuQ29tbWl0cywgSVBhcnNlQ29tbWl0LCBJT3B0aW9ucywgSUZpZWxkc0FycmF5LCBkZWZhdWx0RmllbGRzLCBkZWZhdWx0T3B0aW9ucyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnaXRsb2cob3B0aW9uczogSU9wdGlvbnMsIGNiPzogSUFzeW5jQ2FsbGJhY2spXG57XG5cdG9wdGlvbnMgPSBoYW5kbGVPcHRpb25zKG9wdGlvbnMpO1xuXHRsZXQgeyBiaW4sIGNvbW1hbmRzIH0gPSBidWlsZENvbW1hbmRzKG9wdGlvbnMpO1xuXG5cdGlmICghY2IpXG5cdHtcblx0XHQvLyBydW4gU3luY1xuXHRcdHJldHVybiBwYXJzZUNvbW1pdHNTdGRvdXQob3B0aW9ucywgY3Jvc3NTcGF3bi5zeW5jKGJpbiwgY29tbWFuZHMsIG9wdGlvbnMuZXhlY09wdGlvbnMpLnN0ZG91dClcblx0fVxuXG5cdHJldHVybiBjcm9zc1NwYXduLmFzeW5jKGJpbiwgY29tbWFuZHMsIG9wdGlvbnMuZXhlY09wdGlvbnMpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKGNoaWxkKVxuXHRcdHtcblx0XHRcdGxldCB7IHN0ZG91dCwgc3RkZXJyLCBlcnJvciB9ID0gY2hpbGQ7XG5cblx0XHRcdGxldCBjb21taXRzID0gcGFyc2VDb21taXRzU3Rkb3V0KG9wdGlvbnMsIHN0ZG91dCk7XG5cblx0XHRcdGxldCBlcnIgPSBzdGRlcnIgJiYgc3RkZXJyLnRvU3RyaW5nKCkgfHwgZXJyb3I7XG5cblx0XHRcdGlmIChlcnIpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZWplY3QoZXJyKVxuXHRcdFx0XHRcdC50YXBDYXRjaChmdW5jdGlvbiAoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBjYihlcnIsIGNvbW1pdHMpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGNvbW1pdHMpXG5cdFx0XHRcdFx0LnRhcChmdW5jdGlvbiAoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBjYihudWxsLCBjb21taXRzKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fSlcblx0XHQ7XG59XG5cblxuXG5leHBvcnQgbmFtZXNwYWNlIGdpdGxvZ1xue1xuXHRleHBvcnQgZnVuY3Rpb24gc3luYyhvcHRpb25zOiBJT3B0aW9ucylcblx0e1xuXHRcdHJldHVybiBnaXRsb2cob3B0aW9ucyk7XG5cdH1cblxuXHRleHBvcnQgZnVuY3Rpb24gYXN5bmNDYWxsYmFjayhvcHRpb25zOiBJT3B0aW9ucywgY2I6IElBc3luY0NhbGxiYWNrKTogdm9pZFxuXHR7XG5cdFx0aWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cdFx0fVxuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiBnaXRsb2cob3B0aW9ucywgY2IpO1xuXHR9XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIGFzeW5jKG9wdGlvbnM6IElPcHRpb25zKVxuXHR7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPFJldHVyblR5cGU8dHlwZW9mIHBhcnNlQ29tbWl0cz4+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpXG5cdFx0e1xuXHRcdFx0Z2l0bG9nKG9wdGlvbnMsIGZ1bmN0aW9uIChlcnJvciwgY29tbWl0cylcblx0XHRcdHtcblx0XHRcdFx0aWYgKGVycm9yKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlc29sdmUoY29tbWl0cylcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgaW1wb3J0IHN5bmMgPSBnaXRsb2cuc3luYztcbmV4cG9ydCBpbXBvcnQgYXN5bmNDYWxsYmFjayA9IGdpdGxvZy5hc3luY0NhbGxiYWNrO1xuZXhwb3J0IGltcG9ydCBhc3luYyA9IGdpdGxvZy5hc3luYztcblxuZ2l0bG9nLmdpdGxvZyA9IGdpdGxvZztcbmdpdGxvZy5kZWZhdWx0ID0gZ2l0bG9nO1xuXG5leHBvcnQgZGVmYXVsdCBnaXRsb2dcblxuLy8gQHRzLWlnbm9yZVxuT2JqZWN0LmZyZWV6ZShleHBvcnRzKTtcbiJdfQ==