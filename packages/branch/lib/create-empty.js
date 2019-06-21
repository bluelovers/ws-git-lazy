"use strict";
/**
 * Created by user on 2019/3/10.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const git_root2_1 = require("git-root2");
const util_2 = require("@git-lazy/util/spawn/util");
const current_name_1 = __importDefault(require("./current-name"));
const branch_exists_1 = __importDefault(require("./branch-exists"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLWVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7Ozs7QUFFSCxrREFBd0Y7QUFDeEYseUNBQXVEO0FBQ3ZELHlDQUFzQztBQUN0QyxvREFBbUY7QUFDbkYsa0VBQStDO0FBQy9DLG9FQUFnRDtBQUNoRCxxREFBbUQ7QUFFbkQsa0NBQW1DO0FBRW5DLE1BQU0sY0FBYyxHQUFHLGlDQUFpQyxDQUFDO0FBRXpEOztHQUVHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxPQUFvQztJQUV2RixJQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUNyRDtRQUNDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLENBQUMscUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFDbkI7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQzdEO1FBRUQsSUFBSSxJQUFJLEdBQWlCO1lBQ3hCLEdBQUc7WUFDSCxTQUFTLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFFRixJQUFJLFlBQVksR0FBRyxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLENBQUMscUJBQWMsQ0FBQyxZQUFZLENBQUMsRUFDakM7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLHVCQUFpQixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFDcEM7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixRQUFRLGtCQUFrQixDQUFDLENBQUM7U0FDckU7UUFFRCxJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLG9CQUFjLENBQUMsS0FBSyxFQUFF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LElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFDckI7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDcEY7UUFFRCxPQUFPLEdBQUcsQ0FBQztLQUNYO0FBQ0YsQ0FBQztBQS9IRCw4Q0ErSEM7QUF5Q0Qsa0JBQWUsaUJBQWlCLENBQUE7QUFFaEMsU0FBUyxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLE9BQW1DO0lBRWhGLElBQUkscUJBQWMsQ0FBQyxRQUFRLENBQUMsRUFDNUI7UUFDQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV4QixJQUFJLEdBQUcsR0FBRyxjQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsYUFBeUIsQ0FBQztRQUV0RCxJQUFJLHFCQUFjLENBQUMsR0FBRyxDQUFDLEVBQ3ZCO1lBQ0MsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFbEIsT0FBTyxPQUFPLENBQUM7U0FDZjtLQUNEO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjaGVja0dpdE91dHB1dCwgY3Jvc3NTcGF3blN5bmMsIFNwYXduT3B0aW9ucyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL2dpdCc7XG5pbXBvcnQgeyBkZWJ1Zywgbm90RW1wdHlTdHJpbmcgfSBmcm9tICdAZ2l0LWxhenkvdXRpbCc7XG5pbXBvcnQgeyBpc0dpdFJvb3QgfSBmcm9tICdnaXQtcm9vdDInO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCwgZmlsdGVyQ3Jvc3NTcGF3bkFyZ3YgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi91dGlsJztcbmltcG9ydCBjdXJyZW50QnJhbmNoTmFtZSBmcm9tICcuL2N1cnJlbnQtbmFtZSc7XG5pbXBvcnQgbG9jYWxCcmFuY2hFeGlzdHMgZnJvbSAnLi9icmFuY2gtZXhpc3RzJztcbmltcG9ydCB7IGdldENXRCB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3V0aWwvaW5kZXgnO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmltcG9ydCBnaXRsb2cgPSByZXF1aXJlKCdnaXRsb2cyJyk7XG5cbmNvbnN0IGRlZmF1bHRNZXNzYWdlID0gJ2NyZWF0ZSBlbXB0eSBicmFuY2ggYnkgZ2l0LWxhenknO1xuXG4vKipcbiAqIOW7uueri+epuueZveWIhuaUr1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlCcmFuY2gobmV3X25hbWU6IHN0cmluZywgb3B0aW9ucz86IGNyZWF0ZUVtcHR5QnJhbmNoLklPcHRpb25zKVxue1xuXHRpZiAoKG9wdGlvbnMgPSBfY3JlYXRlRW1wdHlCcmFuY2gobmV3X25hbWUsIG9wdGlvbnMpKSlcblx0e1xuXHRcdGxldCB7IGN3ZCwgbXNnLCBhdXRob3IgfSA9IG9wdGlvbnM7XG5cblx0XHRpZiAoIWlzR2l0Um9vdChjd2QpKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IHRhcmdldCBwYXRoIG5vdCBhIGdpdCByb290IFwiJHtjd2R9XCJgKVxuXHRcdH1cblxuXHRcdGxldCBvcHRzOiBTcGF3bk9wdGlvbnMgPSB7XG5cdFx0XHRjd2QsXG5cdFx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdFx0fTtcblxuXHRcdGxldCBjdXJyZW50X25hbWUgPSBjdXJyZW50QnJhbmNoTmFtZShjd2QpO1xuXG5cdFx0aWYgKCFub3RFbXB0eVN0cmluZyhjdXJyZW50X25hbWUpKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGNhbid0IGdldCBjdXJyZW50IGJyYW5jaCBuYW1lYCk7XG5cdFx0fVxuXG5cdFx0aWYgKGxvY2FsQnJhbmNoRXhpc3RzKG5ld19uYW1lLCBjd2QpKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IHRhcmdldCBicmFuY2ggXCIke25ld19uYW1lfVwiIGFscmVhZHkgZXhpc3RzYCk7XG5cdFx0fVxuXG5cdFx0bGV0IGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIFtcblx0XHRcdCdjaGVja291dCcsXG5cdFx0XHQnLS1vcnBoYW4nLFxuXHRcdFx0bmV3X25hbWUsXG5cdFx0XSwgb3B0cyksIHRydWUpO1xuXG5cdFx0bGV0IGN1cnJlbnRfbmV3ID0gY3VycmVudEJyYW5jaE5hbWUoY3dkKTtcblxuXHRcdGlmIChjdXJyZW50X25ldyA9PT0gbmV3X25hbWUpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogYnJhbmNoIFwiJHtuZXdfbmFtZX1cIiBhbHJlYWR5IGV4aXN0cywgZGVsZXRlIGl0IG9yIGNoYW5nZSBhIG5ldyBuYW1lYCk7XG5cdFx0fVxuXG5cdFx0aWYgKGN1cnJlbnRfbmV3ICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogc29tZXRoaW5nIHdyb25nLCBleHBlY3QgbmV3IGJyYW5jaCBpcyB1bmRlZmluZWQsIGJ1dCBnb3QgXCIke2N1cnJlbnRfbmV3fVwiYCk7XG5cdFx0fVxuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdFx0bGV0IG1vZGVfYXJndjogdW5rbm93bltdO1xuXG5cdFx0c3dpdGNoIChvcHRpb25zLm1vZGUpXG5cdFx0e1xuXHRcdFx0Y2FzZSBjcmVhdGVFbXB0eUJyYW5jaC5FbnVtTW9kZS5PUlBIQU5fUk1fRk9SQ0U6XG5cdFx0XHRcdG1vZGVfYXJndiA9IFtcblx0XHRcdFx0XHQncm0nLFxuXHRcdFx0XHRcdCctcmYnLFxuXHRcdFx0XHRcdCcuJyxcblx0XHRcdFx0XTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIGNyZWF0ZUVtcHR5QnJhbmNoLkVudW1Nb2RlLk9SUEhBTl9STTpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdybScsXG5cdFx0XHRcdFx0Jy1yJyxcblx0XHRcdFx0XHQnLicsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBjcmVhdGVFbXB0eUJyYW5jaC5FbnVtTW9kZS5PUlBIQU46XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRtb2RlX2FyZ3YgPSBbXG5cdFx0XHRcdFx0J3Jlc2V0Jyxcblx0XHRcdFx0XTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1ZyhvcHRpb25zLm1vZGUsIG1vZGVfYXJndik7XG5cblx0XHRjcCA9IGNoZWNrR2l0T3V0cHV0KGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBtb2RlX2FyZ3YsIG9wdHMpLCB0cnVlKTtcblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdGlmICghbXNnIHx8ICFub3RFbXB0eVN0cmluZyhtc2cgPSBTdHJpbmcobXNnKSkpXG5cdFx0e1xuXHRcdFx0bXNnID0gZGVmYXVsdE1lc3NhZ2Vcblx0XHR9XG5cblx0XHRjcCA9IGNoZWNrR2l0T3V0cHV0KGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBmaWx0ZXJDcm9zc1NwYXduQXJndihbXG5cdFx0XHQnY29tbWl0Jyxcblx0XHRcdG5vdEVtcHR5U3RyaW5nKGF1dGhvcikgPyBgLS1hdXRob3I9JHthdXRob3J9YCA6IG51bGwsXG5cdFx0XHQnLS1hbGxvdy1lbXB0eScsXG5cdFx0XHQnLW0nLFxuXHRcdFx0bXNnLFxuXHRcdF0pLCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRsZXQgY3VycmVudF9uZXcyID0gY3VycmVudEJyYW5jaE5hbWUoY3dkKTtcblxuXHRcdGlmIChjdXJyZW50X25ldzIgIT09IG5ld19uYW1lKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGN1cnJlbnQgYnJhbmNoIFwiJHtjdXJyZW50X25ldzJ9XCIgc2hvdWxkIHNhbWUgYXMgXCIke25ld19uYW1lfVwiYCk7XG5cdFx0fVxuXG5cdFx0bGV0IF9sb2dzID0gZ2l0bG9nLnN5bmMoe1xuXHRcdFx0Y3dkLFxuXHRcdH0pO1xuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1ZyhfbG9ncyk7XG5cblx0XHRpZiAoX2xvZ3MubGVuZ3RoICE9PSAxKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGV4cGVjdCBsb2cgbGVuZ3RoID0gMSwgYnV0IGdvdCAke19sb2dzLmxlbmd0aH1gKTtcblx0XHR9XG5cblx0XHRsZXQgX2xvZyA9IF9sb2dzWzBdO1xuXG5cdFx0aWYgKF9sb2cuc3ViamVjdCAhPT0gbXNnKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGNvbW1pdCBsb2cgbm90IHN1YmplY3Qgbm90IGVxdWFsLCBjdXJyZW50IGlzOlxcbiR7X2xvZy5zdWJqZWN0fWApO1xuXHRcdH1cblxuXHRcdGlmIChfbG9nLmZpbGVzLmxlbmd0aClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBleHBlY3QgbG9nIGZpbGVzIGxlbmd0aCA9IDAsIGJ1dCBnb3QgJHtfbG9nLmZpbGVzLmxlbmd0aH1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY3dkO1xuXHR9XG59XG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBjcmVhdGVFbXB0eUJyYW5jaFxue1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG5cdHtcblx0XHQvKipcblx0XHQgKiDopoHlu7rnq4vnqbrnmb3liIbmlK/nmoQgZ2l0IHJlcG8g6Lev5b6R77yM5Y+q5YWB6Kix5qC555uu6YyEXG5cdFx0ICovXG5cdFx0Y3dkPzogc3RyaW5nLFxuXHRcdC8qKlxuXHRcdCAqIOa4heeQhuaqlOahiOeahOaooeW8j1xuXHRcdCAqL1xuXHRcdG1vZGU/OiBFbnVtTW9kZSxcblx0XHQvKipcblx0XHQgKiDoqK3lrpogY29tbWl0IOeahCDoqIrmga9cblx0XHQgKi9cblx0XHRtc2c/OiBzdHJpbmcsXG5cdFx0LyoqXG5cdFx0ICog6Kit5a6aIGNvbW1pdCDnmoQgYXV0aG9yXG5cdFx0ICovXG5cdFx0YXV0aG9yPzogc3RyaW5nLFxuXHR9XG5cblx0ZXhwb3J0IGNvbnN0IGVudW0gRW51bU1vZGVcblx0e1xuXHRcdC8qKlxuXHRcdCAqIOmgkOioreaooeW8jyDmr5TovIPlv6sg5LiN56e76Zmk5qqU5qGIIOWPquaTjeS9nCBHSVQg57SA6YyEXG5cdFx0ICovXG5cdFx0T1JQSEFOID0gMCxcblx0XHQvKipcblx0XHQgKiDmnIPnp7vpmaTmqpTmoYhcblx0XHQgKi9cblx0XHRPUlBIQU5fUk0gPSAxLFxuXHRcdC8qKlxuXHRcdCAqIOacg+W8t+WItuenu+mZpOaqlOahiFxuXHRcdCAqL1xuXHRcdE9SUEhBTl9STV9GT1JDRSA9IDIsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRW1wdHlCcmFuY2hcblxuZnVuY3Rpb24gX2NyZWF0ZUVtcHR5QnJhbmNoKG5ld19uYW1lOiBzdHJpbmcsIG9wdGlvbnM6IGNyZWF0ZUVtcHR5QnJhbmNoLklPcHRpb25zKVxue1xuXHRpZiAobm90RW1wdHlTdHJpbmcobmV3X25hbWUpKVxuXHR7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgY3dkID0gZ2V0Q1dEKG9wdGlvbnMuY3dkLCBnZXRDV0QuRW51bVJlYWxQYXRoLkZTKTtcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhjd2QpKVxuXHRcdHtcblx0XHRcdG9wdGlvbnMuY3dkID0gY3dkO1xuXG5cdFx0XHRyZXR1cm4gb3B0aW9ucztcblx0XHR9XG5cdH1cbn1cbiJdfQ==