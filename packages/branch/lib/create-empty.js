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
const fs = require("fs");
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
        };
        let current_name = current_name_1.default(cwd);
        if (!util_1.notEmptyString(current_name)) {
            throw new Error(`fatal: can't get current branch name`);
        }
        let cp = git_1.checkGitOutput(git_1.crossSpawnSync('git', [
            'checkout',
            '--orphan',
            new_name,
        ], opts), true);
        let current_new = current_name_1.default(cwd);
        if (current_new !== new_name && current_new != null) {
            throw new Error(`fatal: can't create new branch "${new_name}", current is "${current_new}"`);
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
            default:
                mode_argv = [
                    'reset',
                ];
                break;
        }
        util_1.debug.enabled && util_1.debug(mode_argv);
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
        return cwd;
    }
}
exports.createEmptyBranch = createEmptyBranch;
exports.default = createEmptyBranch;
function _createEmptyBranch(new_name, options) {
    if (util_1.notEmptyString(new_name)) {
        options = options || {};
        let { cwd = process.cwd() } = options;
        if (util_1.notEmptyString(cwd) && (cwd = fs.realpathSync(cwd))) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLWVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBQ3ZELHlDQUFzQztBQUN0QyxvREFBbUY7QUFDbkYsaURBQStDO0FBQy9DLHlCQUEwQjtBQUUxQixNQUFNLGNBQWMsR0FBRyxpQ0FBaUMsQ0FBQztBQUV6RDs7R0FFRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsT0FBb0M7SUFFdkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFDckQ7UUFDQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFbkMsSUFBSSxDQUFDLHFCQUFTLENBQUMsR0FBRyxDQUFDLEVBQ25CO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsR0FBRyxHQUFHLENBQUMsQ0FBQTtTQUM3RDtRQUVELElBQUksSUFBSSxHQUFpQjtZQUN4QixHQUFHO1NBQ0gsQ0FBQztRQUVGLElBQUksWUFBWSxHQUFHLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxxQkFBYyxDQUFDLFlBQVksQ0FBQyxFQUNqQztZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN4RDtRQUVELElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsb0JBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDN0MsVUFBVTtZQUNWLFVBQVU7WUFDVixRQUFRO1NBQ1IsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoQixJQUFJLFdBQVcsR0FBRyxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6QyxJQUFJLFdBQVcsS0FBSyxRQUFRLElBQUksV0FBVyxJQUFJLElBQUksRUFDbkQ7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxRQUFRLGtCQUFrQixXQUFXLEdBQUcsQ0FBQyxDQUFDO1NBQzdGO1FBRUQsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxTQUFvQixDQUFDO1FBRXpCLFFBQVEsT0FBTyxDQUFDLElBQUksRUFDcEI7WUFDQztnQkFDQyxTQUFTLEdBQUc7b0JBQ1gsSUFBSTtvQkFDSixJQUFJO29CQUNKLEdBQUc7aUJBQ0gsQ0FBQztnQkFDRixNQUFNO1lBQ1A7Z0JBQ0MsU0FBUyxHQUFHO29CQUNYLE9BQU87aUJBQ1AsQ0FBQztnQkFDRixNQUFNO1NBQ1A7UUFFRCxZQUFLLENBQUMsT0FBTyxJQUFJLFlBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsQyxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxvQkFBYyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbEUsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFjLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUM5QztZQUNDLEdBQUcsR0FBRyxjQUFjLENBQUE7U0FDcEI7UUFFRCxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxvQkFBYyxDQUFDLEtBQUssRUFBRSwyQkFBb0IsQ0FBQztZQUM5RCxRQUFRO1lBQ1IscUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNwRCxlQUFlO1lBQ2YsSUFBSTtZQUNKLEdBQUc7U0FDSCxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakIsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFcEQsT0FBTyxHQUFHLENBQUM7S0FDWDtBQUNGLENBQUM7QUE5RUQsOENBOEVDO0FBcUNELGtCQUFlLGlCQUFpQixDQUFBO0FBRWhDLFNBQVMsa0JBQWtCLENBQUMsUUFBZ0IsRUFBRSxPQUFtQztJQUVoRixJQUFJLHFCQUFjLENBQUMsUUFBUSxDQUFDLEVBQzVCO1FBQ0MsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFeEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFdEMsSUFBSSxxQkFBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDdkQ7WUFDQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUVsQixPQUFPLE9BQU8sQ0FBQztTQUNmO0tBQ0Q7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCB7IGNyb3NzU3Bhd25TeW5jLCBjcm9zc1NwYXduQXN5bmMsIFNwYXduT3B0aW9ucywgY2hlY2tHaXRPdXRwdXQgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi9naXQnO1xuaW1wb3J0IHsgbm90RW1wdHlTdHJpbmcsIGRlYnVnIH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwnO1xuaW1wb3J0IHsgaXNHaXRSb290IH0gZnJvbSAnZ2l0LXJvb3QyJztcbmltcG9ydCB7IGNyb3NzU3Bhd25PdXRwdXQsIGZpbHRlckNyb3NzU3Bhd25Bcmd2IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vdXRpbCc7XG5pbXBvcnQgY3VycmVudEJyYW5jaE5hbWUgZnJvbSAnLi9jdXJyZW50LW5hbWUnO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcblxuY29uc3QgZGVmYXVsdE1lc3NhZ2UgPSAnY3JlYXRlIGVtcHR5IGJyYW5jaCBieSBnaXQtbGF6eSc7XG5cbi8qKlxuICog5bu656uL56m655m95YiG5pSvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZTogc3RyaW5nLCBvcHRpb25zPzogY3JlYXRlRW1wdHlCcmFuY2guSU9wdGlvbnMpXG57XG5cdGlmICgob3B0aW9ucyA9IF9jcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZSwgb3B0aW9ucykpKVxuXHR7XG5cdFx0bGV0IHsgY3dkLCBtc2csIGF1dGhvciB9ID0gb3B0aW9ucztcblxuXHRcdGlmICghaXNHaXRSb290KGN3ZCkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogdGFyZ2V0IHBhdGggbm90IGEgZ2l0IHJvb3QgXCIke2N3ZH1cImApXG5cdFx0fVxuXG5cdFx0bGV0IG9wdHM6IFNwYXduT3B0aW9ucyA9IHtcblx0XHRcdGN3ZCxcblx0XHR9O1xuXG5cdFx0bGV0IGN1cnJlbnRfbmFtZSA9IGN1cnJlbnRCcmFuY2hOYW1lKGN3ZCk7XG5cblx0XHRpZiAoIW5vdEVtcHR5U3RyaW5nKGN1cnJlbnRfbmFtZSkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogY2FuJ3QgZ2V0IGN1cnJlbnQgYnJhbmNoIG5hbWVgKTtcblx0XHR9XG5cblx0XHRsZXQgY3AgPSBjaGVja0dpdE91dHB1dChjcm9zc1NwYXduU3luYygnZ2l0JywgW1xuXHRcdFx0J2NoZWNrb3V0Jyxcblx0XHRcdCctLW9ycGhhbicsXG5cdFx0XHRuZXdfbmFtZSxcblx0XHRdLCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRsZXQgY3VycmVudF9uZXcgPSBjdXJyZW50QnJhbmNoTmFtZShjd2QpO1xuXG5cdFx0aWYgKGN1cnJlbnRfbmV3ICE9PSBuZXdfbmFtZSAmJiBjdXJyZW50X25ldyAhPSBudWxsKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGNhbid0IGNyZWF0ZSBuZXcgYnJhbmNoIFwiJHtuZXdfbmFtZX1cIiwgY3VycmVudCBpcyBcIiR7Y3VycmVudF9uZXd9XCJgKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRsZXQgbW9kZV9hcmd2OiB1bmtub3duW107XG5cblx0XHRzd2l0Y2ggKG9wdGlvbnMubW9kZSlcblx0XHR7XG5cdFx0XHRjYXNlIGNyZWF0ZUVtcHR5QnJhbmNoLkVudW1Nb2RlLk9SUEhBTl9STTpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdybScsXG5cdFx0XHRcdFx0Jy1yJyxcblx0XHRcdFx0XHQnLicsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdyZXNldCcsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcobW9kZV9hcmd2KTtcblxuXHRcdGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIG1vZGVfYXJndiwgb3B0cyksIHRydWUpO1xuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdFx0aWYgKCFtc2cgfHwgIW5vdEVtcHR5U3RyaW5nKG1zZyA9IFN0cmluZyhtc2cpKSlcblx0XHR7XG5cdFx0XHRtc2cgPSBkZWZhdWx0TWVzc2FnZVxuXHRcdH1cblxuXHRcdGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIGZpbHRlckNyb3NzU3Bhd25Bcmd2KFtcblx0XHRcdCdjb21taXQnLFxuXHRcdFx0bm90RW1wdHlTdHJpbmcoYXV0aG9yKSA/IGAtLWF1dGhvcj0ke2F1dGhvcn1gIDogbnVsbCxcblx0XHRcdCctLWFsbG93LWVtcHR5Jyxcblx0XHRcdCctbScsXG5cdFx0XHRtc2csXG5cdFx0XSksIG9wdHMpLCB0cnVlKTtcblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdHJldHVybiBjd2Q7XG5cdH1cbn1cblxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIGNyZWF0ZUVtcHR5QnJhbmNoXG57XG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNcblx0e1xuXHRcdC8qKlxuXHRcdCAqIOimgeW7uueri+epuueZveWIhuaUr+eahCBnaXQgcmVwbyDot6/lvpHvvIzlj6rlhYHoqLHmoLnnm67pjIRcblx0XHQgKi9cblx0XHRjd2Q/OiBzdHJpbmcsXG5cdFx0LyoqXG5cdFx0ICog5riF55CG5qqU5qGI55qE5qih5byPXG5cdFx0ICovXG5cdFx0bW9kZT86IEVudW1Nb2RlLFxuXHRcdC8qKlxuXHRcdCAqIOioreWumiBjb21taXQg55qEIOioiuaBr1xuXHRcdCAqL1xuXHRcdG1zZz86IHN0cmluZyxcblx0XHQvKipcblx0XHQgKiDoqK3lrpogY29tbWl0IOeahCBhdXRob3Jcblx0XHQgKi9cblx0XHRhdXRob3I/OiBzdHJpbmcsXG5cdH1cblxuXHRleHBvcnQgY29uc3QgZW51bSBFbnVtTW9kZVxuXHR7XG5cdFx0LyoqXG5cdFx0ICog6aCQ6Kit5qih5byPIOavlOi8g+W/qyDkuI3np7vpmaTmqpTmoYgg5Y+q5pON5L2cIEdJVCDntIDpjIRcblx0XHQgKi9cblx0XHRPUlBIQU4gPSAwLFxuXHRcdC8qKlxuXHRcdCAqIOacg+enu+mZpOaqlOahiFxuXHRcdCAqL1xuXHRcdE9SUEhBTl9STSA9IDEsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRW1wdHlCcmFuY2hcblxuZnVuY3Rpb24gX2NyZWF0ZUVtcHR5QnJhbmNoKG5ld19uYW1lOiBzdHJpbmcsIG9wdGlvbnM6IGNyZWF0ZUVtcHR5QnJhbmNoLklPcHRpb25zKVxue1xuXHRpZiAobm90RW1wdHlTdHJpbmcobmV3X25hbWUpKVxuXHR7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgeyBjd2QgPSBwcm9jZXNzLmN3ZCgpIH0gPSBvcHRpb25zO1xuXG5cdFx0aWYgKG5vdEVtcHR5U3RyaW5nKGN3ZCkgJiYgKGN3ZCA9IGZzLnJlYWxwYXRoU3luYyhjd2QpKSlcblx0XHR7XG5cdFx0XHRvcHRpb25zLmN3ZCA9IGN3ZDtcblxuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XG5cdFx0fVxuXHR9XG59XG4iXX0=