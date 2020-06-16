"use strict";
/**
 * Created by user on 2020/6/6.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGitPath = void 0;
const upath2_1 = require("upath2");
const core_1 = __importDefault(require("git-root2/core"));
function handleGitPath(options) {
    var _a;
    let cwd = upath2_1.resolve((_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd());
    let root = upath2_1.normalize(core_1.default(cwd));
    return {
        cwd,
        root,
    };
}
exports.handleGitPath = handleGitPath;
//# sourceMappingURL=git.js.map