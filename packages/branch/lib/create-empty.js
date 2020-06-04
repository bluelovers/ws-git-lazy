"use strict";
/**
 * Created by user on 2019/3/10.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyBranch = void 0;
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const git_root2_1 = require("git-root2");
const util_2 = require("@git-lazy/util/spawn/util");
const current_name_1 = __importDefault(require("./current-name"));
const branch_exists_1 = __importDefault(require("./branch-exists"));
const index_1 = require("@git-lazy/util/util/index");
const gitlog2_1 = __importDefault(require("gitlog2"));
const defaultMessage = 'create empty branch by git-lazy';
/**
 * 建立空白分支
 */
function createEmptyBranch(new_name, options) {
    if ((options = _createEmptyBranch(new_name, options))) {
        let { cwd, msg, author } = options;
        if (!git_root2_1.isGitRoot(cwd)) {
            throw new Error(`fatal: target path not a git root "${cwd}"`);
        }
        let opts = {
            cwd,
            stripAnsi: true,
        };
        let current_name = current_name_1.default(cwd);
        if (!util_1.notEmptyString(current_name)) {
            throw new Error(`fatal: can't get current branch name`);
        }
        if (branch_exists_1.default(new_name, cwd)) {
            throw new Error(`fatal: target branch "${new_name}" already exists`);
        }
        let cp = git_1.checkGitOutput(git_1.crossSpawnSync('git', [
            'checkout',
            '--orphan',
            new_name,
        ], opts), true);
        let current_new = current_name_1.default(cwd);
        if (current_new === new_name) {
            throw new Error(`fatal: branch "${new_name}" already exists, delete it or change a new name`);
        }
        if (current_new != null) {
            throw new Error(`fatal: something wrong, expect new branch is undefined, but got "${current_new}"`);
        }
        util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
        let mode_argv;
        switch (options.mode) {
            case 2 /* ORPHAN_RM_FORCE */:
                mode_argv = [
                    'rm',
                    '-rf',
                    '.',
                ];
                break;
            case 1 /* ORPHAN_RM */:
                mode_argv = [
                    'rm',
                    '-r',
                    '.',
                ];
                break;
            case 0 /* ORPHAN */:
            default:
                mode_argv = [
                    'reset',
                ];
                break;
        }
        util_1.debug.enabled && util_1.debug(options.mode, mode_argv);
        cp = git_1.checkGitOutput(git_1.crossSpawnSync('git', mode_argv, opts), true);
        util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
        if (!msg || !util_1.notEmptyString(msg = String(msg))) {
            msg = defaultMessage;
        }
        cp = git_1.checkGitOutput(git_1.crossSpawnSync('git', util_2.filterCrossSpawnArgv([
            'commit',
            util_1.notEmptyString(author) ? `--author=${author}` : null,
            '--allow-empty',
            '-m',
            msg,
        ]), opts), true);
        util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
        let current_new2 = current_name_1.default(cwd);
        if (current_new2 !== new_name) {
            throw new Error(`fatal: current branch "${current_new2}" should same as "${new_name}"`);
        }
        let _logs = gitlog2_1.default.sync({
            cwd,
        });
        util_1.debug.enabled && util_1.debug(_logs);
        if (_logs.length !== 1) {
            throw new Error(`fatal: expect log length = 1, but got ${_logs.length}`);
        }
        let _log = _logs[0];
        if (_log.subject !== msg) {
            throw new Error(`fatal: commit log not subject not equal, current is:\n${_log.subject}`);
        }
        if (_log.files.length) {
            throw new Error(`fatal: expect log files length = 0, but got ${_log.files.length}`);
        }
        return cwd;
    }
}
exports.createEmptyBranch = createEmptyBranch;
exports.default = createEmptyBranch;
function _createEmptyBranch(new_name, options) {
    if (util_1.notEmptyString(new_name)) {
        options = options || {};
        let cwd = index_1.getCWD(options.cwd, 1 /* FS */);
        if (util_1.notEmptyString(cwd)) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=create-empty.js.map