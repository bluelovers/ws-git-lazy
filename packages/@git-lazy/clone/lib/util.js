"use strict";
/**
 * Created by user on 2020/6/15.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCloneCmd = exports.handleOptions = void 0;
const path_1 = require("path");
const util_args_1 = __importDefault(require("@git-lazy/util-args"));
const lodash_1 = require("lodash");
function handleOptions(remote, options) {
    var _a, _b;
    options = {
        ...options,
    };
    options.cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    if (((_b = options.targetDir) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        options.targetDir = path_1.resolve(options.cwd, options.targetDir);
    }
    options = lodash_1.defaultsDeep(options, {
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
exports.handleOptions = handleOptions;
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
    let ls = util_args_1.default((_b = options.cloneOptions) !== null && _b !== void 0 ? _b : {});
    if (ls.length) {
        args.push(...ls);
    }
    return args;
}
exports.gitCloneCmd = gitCloneCmd;
//# sourceMappingURL=util.js.map