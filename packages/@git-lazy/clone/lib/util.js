"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.gitCloneCmd = gitCloneCmd;
const path_1 = require("path");
const util_args_1 = require("@git-lazy/util-args");
const lodash_1 = require("lodash");
function handleOptions(remote, options) {
    var _a, _b;
    options = {
        ...options,
    };
    options.cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    if (((_b = options.targetDir) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        options.targetDir = (0, path_1.resolve)(options.cwd, options.targetDir);
    }
    options = (0, lodash_1.defaultsDeep)(options, {
        cloneOptions: {
            depth: 50,
            singleBranch: true,
        },
    });
    return {
        remote,
        options,
    };
}
function gitCloneCmd(remote, options) {
    var _a, _b;
    ({ remote, options } = handleOptions(remote, options));
    const args = [
        'clone',
        remote,
    ];
    if (((_a = options.targetDir) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        args.push(options.targetDir);
    }
    let ls = (0, util_args_1.lazyUnParse)((_b = options.cloneOptions) !== null && _b !== void 0 ? _b : {});
    if (ls.length) {
        args.push(...ls);
    }
    return args;
}
//# sourceMappingURL=util.js.map