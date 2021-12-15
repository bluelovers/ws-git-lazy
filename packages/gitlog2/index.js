"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.asyncCallback = exports.sync = exports.gitlog = exports.defaultOptions = exports.defaultFields = exports.EnumGitDateFormat = void 0;
const tslib_1 = require("tslib");
const type_1 = require("./lib/type");
Object.defineProperty(exports, "defaultOptions", { enumerable: true, get: function () { return type_1.defaultOptions; } });
Object.defineProperty(exports, "EnumGitDateFormat", { enumerable: true, get: function () { return type_1.EnumGitDateFormat; } });
Object.defineProperty(exports, "defaultFields", { enumerable: true, get: function () { return type_1.defaultFields; } });
const util_1 = require("./lib/util");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const spawn_1 = require("@git-lazy/spawn");
function gitlog(options, cb) {
    options = (0, util_1.handleOptions)(options);
    let { bin, commands } = (0, util_1.buildCommands)(options);
    if (!cb) {
        // run Sync
        return (0, util_1.parseCommitsStdout)(options, (0, spawn_1.crossSpawnGitSync)(bin, commands, options.execOptions).stdout);
    }
    return (0, spawn_1.crossSpawnGitAsync)(bin, commands, options.execOptions)
        .then(function (child) {
        let { stdout, stderr, error } = child;
        let commits = (0, util_1.parseCommitsStdout)(options, stdout);
        let err = stderr && stderr.toString() || error || null;
        if (err) {
            let e = (0, util_1.createError)(err, {
                bin,
                commands,
                child,
                commits,
            });
            return bluebird_1.default.reject(err)
                .tapCatch(function () {
                return cb(e, commits);
            });
        }
        else {
            return bluebird_1.default.resolve(commits)
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
    gitlog.EnumGitDateFormat = type_1.EnumGitDateFormat;
})(gitlog = exports.gitlog || (exports.gitlog = {}));
exports.sync = gitlog.sync;
exports.asyncCallback = gitlog.asyncCallback;
exports.async = gitlog.async;
gitlog.gitlog = gitlog;
gitlog.default = gitlog;
exports.default = gitlog;
//# sourceMappingURL=index.js.map