"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameRemoteBranch = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2019/3/10.
 */
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const fs_1 = tslib_1.__importDefault(require("fs"));
const stringify_1 = require("@lazy-spawn/stringify");
function renameRemoteBranch(remote, old_name, new_name, options) {
    if (options = _check_before(remote, old_name, new_name, options)) {
        let { cwd } = options;
        let cp = (0, git_1.crossSpawnSync)('git', [
            'push',
            remote,
            `${remote}/${old_name}:${new_name}`,
            `:${old_name}`,
        ], {
            cwd,
        });
        if (!cp.error) {
            console.log((0, stringify_1.crossSpawnOutput)(cp.output));
            return true;
        }
        util_1.debug.enabled && (0, util_1.debug)((0, stringify_1.crossSpawnOutput)(cp.output));
    }
}
exports.renameRemoteBranch = renameRemoteBranch;
exports.default = renameRemoteBranch;
function _check_before(remote, old_name, new_name, options) {
    if ((0, util_1.notEmptyString)(remote) && (0, util_1.notEmptyString)(old_name) && (0, util_1.notEmptyString)(new_name) && old_name !== new_name) {
        options = options || {};
        let { cwd = process.cwd() } = options;
        if ((0, util_1.notEmptyString)(cwd) && (cwd = fs_1.default.realpathSync(cwd))) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=rename-remote-branch.js.map