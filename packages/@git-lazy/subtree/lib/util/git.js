"use strict";
/**
 * Created by user on 2020/6/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGitPath = void 0;
const upath2_1 = require("upath2");
const core_1 = require("git-root2/core");
function handleGitPath(options) {
    var _a;
    let cwd = (0, upath2_1.resolve)((_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd());
    let root = (0, upath2_1.normalize)((0, core_1.gitRoot)(cwd));
    return {
        cwd,
        root,
    };
}
exports.handleGitPath = handleGitPath;
//# sourceMappingURL=git.js.map