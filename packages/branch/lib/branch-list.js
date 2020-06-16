"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchList = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
function localBranchList(REPO_PATH) {
    let cp = git_1.crossSpawnSync('git', [
        'branch',
        '--list',
        '--format=%(refname)',
    ], {
        cwd: REPO_PATH,
    });
    if (!cp.error) {
        // @ts-ignore
        let out = util_2.crossSpawnOutput(cp.stdout, {
            clearEol: true,
            stripAnsi: true,
        });
        let ls = out.split(/\n/).map(function (s) {
            return s.trim();
        });
        if (ls.length) {
            return ls;
        }
    }
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    return [];
}
exports.localBranchList = localBranchList;
exports.default = localBranchList;
//# sourceMappingURL=branch-list.js.map