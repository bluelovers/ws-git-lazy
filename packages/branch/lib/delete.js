"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
const index_1 = require("@git-lazy/util/util/index");
function deleteBranch(REPO_PATH, name, force) {
    let cp = git_1.crossSpawnSync('git', [
        'branch',
        force === true ? '-D' : '-d',
        name,
    ], {
        cwd: index_1.getCWD(REPO_PATH, 1 /* FS */),
    });
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    if (!cp.error) {
        return true;
    }
}
exports.deleteBranch = deleteBranch;
exports.default = deleteBranch;
//# sourceMappingURL=delete.js.map