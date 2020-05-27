"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameRemoteBranch = void 0;
/**
 * Created by user on 2019/3/10.
 */
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
const fs = require("fs");
function renameRemoteBranch(remote, old_name, new_name, options) {
    if (options = _check_before(remote, old_name, new_name, options)) {
        let { cwd } = options;
        let cp = git_1.crossSpawnSync('git', [
            'push',
            remote,
            `${remote}/${old_name}:${new_name}`,
            `:${old_name}`,
        ], {
            cwd,
        });
        if (!cp.error) {
            console.log(util_2.crossSpawnOutput(cp.output));
            return true;
        }
        util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    }
}
exports.renameRemoteBranch = renameRemoteBranch;
exports.default = renameRemoteBranch;
function _check_before(remote, old_name, new_name, options) {
    if (util_1.notEmptyString(remote) && util_1.notEmptyString(old_name) && util_1.notEmptyString(new_name) && old_name !== new_name) {
        options = options || {};
        let { cwd = process.cwd() } = options;
        if (util_1.notEmptyString(cwd) && (cwd = fs.realpathSync(cwd))) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=rename-remote-branch.js.map