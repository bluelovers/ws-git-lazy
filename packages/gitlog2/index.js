"use strict";
exports.__esModule = true;
var type_1 = require("./lib/type");
exports.defaultOptions = type_1.defaultOptions;
exports.EnumGitDateFormat = type_1.EnumGitDateFormat;
exports.defaultFields = type_1.defaultFields;
var util_1 = require("./lib/util");
var Bluebird = require("bluebird");
var git_1 = require("@git-lazy/util/spawn/git");
function gitlog(options, cb) {
    options = util_1.handleOptions(options);
    var _a = util_1.buildCommands(options), bin = _a.bin, commands = _a.commands;
    if (!cb) {
        // run Sync
        return util_1.parseCommitsStdout(options, git_1.crossSpawnSync(bin, commands, options.execOptions).stdout);
    }
    return git_1.crossSpawnAsync(bin, commands, options.execOptions)
        .then(function (child) {
        var stdout = child.stdout, stderr = child.stderr, error = child.error;
        var commits = util_1.parseCommitsStdout(options, stdout);
        var err = stderr && stderr.toString() || error || null;
        if (err) {
            var e_1 = util_1.createError(err, {
                bin: bin,
                commands: commands,
                child: child,
                commits: commits,
            });
            return Bluebird.reject(err)
                .tapCatch(function () {
                return cb(e_1, commits);
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
            throw new TypeError("expected cb as function");
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
gitlog["default"] = gitlog;
exports["default"] = gitlog;
// @ts-ignore
Object.freeze(exports);
