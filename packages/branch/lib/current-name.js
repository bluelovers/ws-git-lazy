"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentBranchName = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
/**
 * 取得目前分支名稱
 */
function currentBranchName(REPO_PATH) {
    let cp = git_1.crossSpawnSync('git', [
        'rev-parse',
        '--abbrev-ref',
        'HEAD',
    ], {
        cwd: REPO_PATH,
    });
    if (!cp.error) {
        let name = util_2.crossSpawnOutput(cp.stdout, {
            clearEol: true,
            stripAnsi: true,
        });
        if (util_1.notEmptyString(name) && !/\s/.test(name)) {
            return name;
        }
    }
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
}
exports.currentBranchName = currentBranchName;
exports.default = currentBranchName;
//# sourceMappingURL=current-name.js.map