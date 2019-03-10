"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const git_root2_1 = require("git-root2");
const util_2 = require("@git-lazy/util/spawn/util");
const current_name_1 = require("./current-name");
const branch_exists_1 = require("./branch-exists");
const index_1 = require("@git-lazy/util/util/index");
const gitlog = require("gitlog2");
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
        let _logs = gitlog.sync({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLWVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBd0Y7QUFDeEYseUNBQXVEO0FBQ3ZELHlDQUFzQztBQUN0QyxvREFBbUY7QUFDbkYsaURBQStDO0FBQy9DLG1EQUFnRDtBQUNoRCxxREFBbUQ7QUFFbkQsa0NBQW1DO0FBRW5DLE1BQU0sY0FBYyxHQUFHLGlDQUFpQyxDQUFDO0FBRXpEOztHQUVHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxPQUFvQztJQUV2RixJQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUNyRDtRQUNDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLENBQUMscUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFDbkI7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQzdEO1FBRUQsSUFBSSxJQUFJLEdBQWlCO1lBQ3hCLEdBQUc7WUFDSCxTQUFTLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFFRixJQUFJLFlBQVksR0FBRyxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLENBQUMscUJBQWMsQ0FBQyxZQUFZLENBQUMsRUFDakM7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLHVCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFDcEM7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixRQUFRLGtCQUFrQixDQUFDLENBQUM7U0FDckU7UUFFRCxJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLG9CQUFjLENBQUMsS0FBSyxFQUFFO1lB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QUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUNwRjtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1g7QUFDRixDQUFDO0FBeEhELDhDQXdIQztBQXFDRCxrQkFBZSxpQkFBaUIsQ0FBQTtBQUVoQyxTQUFTLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsT0FBbUM7SUFFaEYsSUFBSSxxQkFBYyxDQUFDLFFBQVEsQ0FBQyxFQUM1QjtRQUNDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXhCLElBQUksR0FBRyxHQUFHLGNBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxhQUF5QixDQUFDO1FBRXRELElBQUkscUJBQWMsQ0FBQyxHQUFHLENBQUMsRUFDdkI7WUFDQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUVsQixPQUFPLE9BQU8sQ0FBQztTQUNmO0tBQ0Q7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCB7IGNoZWNrR2l0T3V0cHV0LCBjcm9zc1NwYXduU3luYywgU3Bhd25PcHRpb25zIH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IGRlYnVnLCBub3RFbXB0eVN0cmluZyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsJztcbmltcG9ydCB7IGlzR2l0Um9vdCB9IGZyb20gJ2dpdC1yb290Mic7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0LCBmaWx0ZXJDcm9zc1NwYXduQXJndiB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuaW1wb3J0IGN1cnJlbnRCcmFuY2hOYW1lIGZyb20gJy4vY3VycmVudC1uYW1lJztcbmltcG9ydCBsb2NhbEJyYW5jaEV4aXN0cyBmcm9tICcuL2JyYW5jaC1leGlzdHMnO1xuaW1wb3J0IHsgZ2V0Q1dEIH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvdXRpbC9pbmRleCc7XG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IGdpdGxvZyA9IHJlcXVpcmUoJ2dpdGxvZzInKTtcblxuY29uc3QgZGVmYXVsdE1lc3NhZ2UgPSAnY3JlYXRlIGVtcHR5IGJyYW5jaCBieSBnaXQtbGF6eSc7XG5cbi8qKlxuICog5bu656uL56m655m95YiG5pSvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZTogc3RyaW5nLCBvcHRpb25zPzogY3JlYXRlRW1wdHlCcmFuY2guSU9wdGlvbnMpXG57XG5cdGlmICgob3B0aW9ucyA9IF9jcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZSwgb3B0aW9ucykpKVxuXHR7XG5cdFx0bGV0IHsgY3dkLCBtc2csIGF1dGhvciB9ID0gb3B0aW9ucztcblxuXHRcdGlmICghaXNHaXRSb290KGN3ZCkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogdGFyZ2V0IHBhdGggbm90IGEgZ2l0IHJvb3QgXCIke2N3ZH1cImApXG5cdFx0fVxuXG5cdFx0bGV0IG9wdHM6IFNwYXduT3B0aW9ucyA9IHtcblx0XHRcdGN3ZCxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9O1xuXG5cdFx0bGV0IGN1cnJlbnRfbmFtZSA9IGN1cnJlbnRCcmFuY2hOYW1lKGN3ZCk7XG5cblx0XHRpZiAoIW5vdEVtcHR5U3RyaW5nKGN1cnJlbnRfbmFtZSkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogY2FuJ3QgZ2V0IGN1cnJlbnQgYnJhbmNoIG5hbWVgKTtcblx0XHR9XG5cblx0XHRpZiAobG9jYWxCcmFuY2hFeGlzdHMobmV3X25hbWUsIGN3ZCkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogdGFyZ2V0IGJyYW5jaCBcIiR7bmV3X25hbWV9XCIgYWxyZWFkeSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRsZXQgY3AgPSBjaGVja0dpdE91dHB1dChjcm9zc1NwYXduU3luYygnZ2l0JywgW1xuXHRcdFx0J2NoZWNrb3V0Jyxcblx0XHRcdCctLW9ycGhhbicsXG5cdFx0XHRuZXdfbmFtZSxcblx0XHRdLCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRsZXQgY3VycmVudF9uZXcgPSBjdXJyZW50QnJhbmNoTmFtZShjd2QpO1xuXG5cdFx0aWYgKGN1cnJlbnRfbmV3ID09PSBuZXdfbmFtZSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBicmFuY2ggXCIke25ld19uYW1lfVwiIGFscmVhZHkgZXhpc3RzLCBkZWxldGUgaXQgb3IgY2hhbmdlIGEgbmV3IG5hbWVgKTtcblx0XHR9XG5cblx0XHRpZiAoY3VycmVudF9uZXcgIT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBzb21ldGhpbmcgd3JvbmcsIGV4cGVjdCBuZXcgYnJhbmNoIGlzIHVuZGVmaW5lZCwgYnV0IGdvdCBcIiR7Y3VycmVudF9uZXd9XCJgKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRsZXQgbW9kZV9hcmd2OiB1bmtub3duW107XG5cblx0XHRzd2l0Y2ggKG9wdGlvbnMubW9kZSlcblx0XHR7XG5cdFx0XHRjYXNlIGNyZWF0ZUVtcHR5QnJhbmNoLkVudW1Nb2RlLk9SUEhBTl9STTpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdybScsXG5cdFx0XHRcdFx0Jy1yJyxcblx0XHRcdFx0XHQnLicsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBjcmVhdGVFbXB0eUJyYW5jaC5FbnVtTW9kZS5PUlBIQU46XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRtb2RlX2FyZ3YgPSBbXG5cdFx0XHRcdFx0J3Jlc2V0Jyxcblx0XHRcdFx0XTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1ZyhvcHRpb25zLm1vZGUsIG1vZGVfYXJndik7XG5cblx0XHRjcCA9IGNoZWNrR2l0T3V0cHV0KGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBtb2RlX2FyZ3YsIG9wdHMpLCB0cnVlKTtcblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdGlmICghbXNnIHx8ICFub3RFbXB0eVN0cmluZyhtc2cgPSBTdHJpbmcobXNnKSkpXG5cdFx0e1xuXHRcdFx0bXNnID0gZGVmYXVsdE1lc3NhZ2Vcblx0XHR9XG5cblx0XHRjcCA9IGNoZWNrR2l0T3V0cHV0KGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBmaWx0ZXJDcm9zc1NwYXduQXJndihbXG5cdFx0XHQnY29tbWl0Jyxcblx0XHRcdG5vdEVtcHR5U3RyaW5nKGF1dGhvcikgPyBgLS1hdXRob3I9JHthdXRob3J9YCA6IG51bGwsXG5cdFx0XHQnLS1hbGxvdy1lbXB0eScsXG5cdFx0XHQnLW0nLFxuXHRcdFx0bXNnLFxuXHRcdF0pLCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRsZXQgY3VycmVudF9uZXcyID0gY3VycmVudEJyYW5jaE5hbWUoY3dkKTtcblxuXHRcdGlmIChjdXJyZW50X25ldzIgIT09IG5ld19uYW1lKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGN1cnJlbnQgYnJhbmNoIFwiJHtjdXJyZW50X25ldzJ9XCIgc2hvdWxkIHNhbWUgYXMgXCIke25ld19uYW1lfVwiYCk7XG5cdFx0fVxuXG5cdFx0bGV0IF9sb2dzID0gZ2l0bG9nLnN5bmMoe1xuXHRcdFx0Y3dkLFxuXHRcdH0pO1xuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1ZyhfbG9ncyk7XG5cblx0XHRpZiAoX2xvZ3MubGVuZ3RoICE9PSAxKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGV4cGVjdCBsb2cgbGVuZ3RoID0gMSwgYnV0IGdvdCAke19sb2dzLmxlbmd0aH1gKTtcblx0XHR9XG5cblx0XHRsZXQgX2xvZyA9IF9sb2dzWzBdO1xuXG5cdFx0aWYgKF9sb2cuc3ViamVjdCAhPT0gbXNnKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGNvbW1pdCBsb2cgbm90IHN1YmplY3Qgbm90IGVxdWFsLCBjdXJyZW50IGlzOlxcbiR7X2xvZy5zdWJqZWN0fWApO1xuXHRcdH1cblxuXHRcdGlmIChfbG9nLmZpbGVzLmxlbmd0aClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBleHBlY3QgbG9nIGZpbGVzIGxlbmd0aCA9IDAsIGJ1dCBnb3QgJHtfbG9nLmZpbGVzLmxlbmd0aH1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY3dkO1xuXHR9XG59XG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBjcmVhdGVFbXB0eUJyYW5jaFxue1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG5cdHtcblx0XHQvKipcblx0XHQgKiDopoHlu7rnq4vnqbrnmb3liIbmlK/nmoQgZ2l0IHJlcG8g6Lev5b6R77yM5Y+q5YWB6Kix5qC555uu6YyEXG5cdFx0ICovXG5cdFx0Y3dkPzogc3RyaW5nLFxuXHRcdC8qKlxuXHRcdCAqIOa4heeQhuaqlOahiOeahOaooeW8j1xuXHRcdCAqL1xuXHRcdG1vZGU/OiBFbnVtTW9kZSxcblx0XHQvKipcblx0XHQgKiDoqK3lrpogY29tbWl0IOeahCDoqIrmga9cblx0XHQgKi9cblx0XHRtc2c/OiBzdHJpbmcsXG5cdFx0LyoqXG5cdFx0ICog6Kit5a6aIGNvbW1pdCDnmoQgYXV0aG9yXG5cdFx0ICovXG5cdFx0YXV0aG9yPzogc3RyaW5nLFxuXHR9XG5cblx0ZXhwb3J0IGNvbnN0IGVudW0gRW51bU1vZGVcblx0e1xuXHRcdC8qKlxuXHRcdCAqIOmgkOioreaooeW8jyDmr5TovIPlv6sg5LiN56e76Zmk5qqU5qGIIOWPquaTjeS9nCBHSVQg57SA6YyEXG5cdFx0ICovXG5cdFx0T1JQSEFOID0gMCxcblx0XHQvKipcblx0XHQgKiDmnIPnp7vpmaTmqpTmoYhcblx0XHQgKi9cblx0XHRPUlBIQU5fUk0gPSAxLFxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVtcHR5QnJhbmNoXG5cbmZ1bmN0aW9uIF9jcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZTogc3RyaW5nLCBvcHRpb25zOiBjcmVhdGVFbXB0eUJyYW5jaC5JT3B0aW9ucylcbntcblx0aWYgKG5vdEVtcHR5U3RyaW5nKG5ld19uYW1lKSlcblx0e1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0bGV0IGN3ZCA9IGdldENXRChvcHRpb25zLmN3ZCwgZ2V0Q1dELkVudW1SZWFsUGF0aC5GUyk7XG5cblx0XHRpZiAobm90RW1wdHlTdHJpbmcoY3dkKSlcblx0XHR7XG5cdFx0XHRvcHRpb25zLmN3ZCA9IGN3ZDtcblxuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XG5cdFx0fVxuXHR9XG59XG4iXX0=