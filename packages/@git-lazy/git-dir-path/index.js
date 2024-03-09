"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGitDir = findGitDir;
exports.findGitDirAsync = findGitDirAsync;
const git_env_var_1 = require("@git-lazy/git-env-var");
const find_up_paths_1 = require("find-up-paths");
const DEFAULT_GIT_DIR = '.git';
function findGitDir(options) {
    var _a, _b;
    options !== null && options !== void 0 ? options : (options = {});
    const GIT_DIR = (_a = (0, git_env_var_1.getGitEnv)('GIT_DIR', options.env)) !== null && _a !== void 0 ? _a : DEFAULT_GIT_DIR;
    return (_b = (0, find_up_paths_1.findUpPaths)(GIT_DIR, {
        cwd: options.cwd,
        onlyDirectories: true,
        throwIfNoEntry: options.throwIfNoEntry,
    })) === null || _b === void 0 ? void 0 : _b.result;
}
function findGitDirAsync(options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    const GIT_DIR = (_a = (0, git_env_var_1.getGitEnv)('GIT_DIR', options.env)) !== null && _a !== void 0 ? _a : DEFAULT_GIT_DIR;
    return (0, find_up_paths_1.findUpPathsAsync)(GIT_DIR, {
        cwd: options.cwd,
        onlyDirectories: true,
        throwIfNoEntry: options.throwIfNoEntry,
    }).then(data => data === null || data === void 0 ? void 0 : data.result);
}
exports.default = findGitDir;
//# sourceMappingURL=index.js.map