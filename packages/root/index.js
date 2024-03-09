"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitRoot = exports.gitRoot = void 0;
exports.hasGit = hasGit;
const core_1 = require("git-root2/core");
Object.defineProperty(exports, "gitRoot", { enumerable: true, get: function () { return core_1.gitRoot; } });
Object.defineProperty(exports, "isGitRoot", { enumerable: true, get: function () { return core_1.isGitRoot; } });
function hasGit(cwd) {
    if (!cwd || typeof cwd !== 'string' || !(0, core_1.gitRoot)(cwd)) {
        throw new TypeError(`'${cwd}' is not exists in git`);
    }
    return cwd;
}
exports.default = core_1.gitRoot;
//# sourceMappingURL=index.js.map