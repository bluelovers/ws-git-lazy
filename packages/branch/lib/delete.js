"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const index_1 = require("@git-lazy/util/util/index");
const stringify_1 = require("@lazy-spawn/stringify");
function deleteBranch(REPO_PATH, name, force) {
    let cp = (0, git_1.crossSpawnSync)('git', [
        'branch',
        force === true ? '-D' : '-d',
        name,
    ], {
        cwd: (0, index_1.getCWD)(REPO_PATH, 1 /* getCWD.EnumRealPath.FS */),
    });
    util_1.debug.enabled && (0, util_1.debug)((0, stringify_1.crossSpawnOutput)(cp.output));
    if (!cp.error) {
        return true;
    }
}
exports.deleteBranch = deleteBranch;
exports.default = deleteBranch;
//# sourceMappingURL=delete.js.map