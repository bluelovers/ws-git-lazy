"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchList = localBranchList;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const stringify_1 = require("@lazy-spawn/stringify");
function localBranchList(REPO_PATH) {
    let cp = (0, git_1.crossSpawnSync)('git', [
        'branch',
        '--list',
        '--format=%(refname)',
    ], {
        cwd: REPO_PATH,
    });
    if (!cp.error) {
        // @ts-ignore
        let out = (0, stringify_1.crossSpawnOutput)(cp.stdout, {
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
    util_1.debug.enabled && (0, util_1.debug)((0, stringify_1.crossSpawnOutput)(cp.output));
    return [];
}
exports.default = localBranchList;
//# sourceMappingURL=branch-list.js.map