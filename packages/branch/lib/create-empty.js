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
const branch_exists_1 = require("./branch-exists");
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
        let current_new2 = current_name_1.default(cwd);
        if (current_new2 !== new_name) {
            throw new Error(`fatal: current branch "${current_new2}" should same as "${new_name}"`);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLWVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBQ3ZELHlDQUFzQztBQUN0QyxvREFBbUY7QUFDbkYsaURBQStDO0FBQy9DLHlCQUEwQjtBQUMxQixtREFBZ0Q7QUFFaEQsTUFBTSxjQUFjLEdBQUcsaUNBQWlDLENBQUM7QUFFekQ7O0dBRUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLE9BQW9DO0lBRXZGLElBQUksQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQ3JEO1FBQ0MsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRW5DLElBQUksQ0FBQyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxFQUNuQjtZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUE7U0FDN0Q7UUFFRCxJQUFJLElBQUksR0FBaUI7WUFDeEIsR0FBRztZQUNILFNBQVMsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUVGLElBQUksWUFBWSxHQUFHLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxxQkFBYyxDQUFDLFlBQVksQ0FBQyxFQUNqQztZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN4RDtRQUVELElBQUksdUJBQWlCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUNwQztZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFFBQVEsa0JBQWtCLENBQUMsQ0FBQztTQUNyRTtRQUVELElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsb0JBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDN0MsVUFBVTtZQUNW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MTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjcm9zc1NwYXduU3luYywgY3Jvc3NTcGF3bkFzeW5jLCBTcGF3bk9wdGlvbnMsIGNoZWNrR2l0T3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IG5vdEVtcHR5U3RyaW5nLCBkZWJ1ZyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsJztcbmltcG9ydCB7IGlzR2l0Um9vdCB9IGZyb20gJ2dpdC1yb290Mic7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0LCBmaWx0ZXJDcm9zc1NwYXduQXJndiB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuaW1wb3J0IGN1cnJlbnRCcmFuY2hOYW1lIGZyb20gJy4vY3VycmVudC1uYW1lJztcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgbG9jYWxCcmFuY2hFeGlzdHMgZnJvbSAnLi9icmFuY2gtZXhpc3RzJztcblxuY29uc3QgZGVmYXVsdE1lc3NhZ2UgPSAnY3JlYXRlIGVtcHR5IGJyYW5jaCBieSBnaXQtbGF6eSc7XG5cbi8qKlxuICog5bu656uL56m655m95YiG5pSvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZTogc3RyaW5nLCBvcHRpb25zPzogY3JlYXRlRW1wdHlCcmFuY2guSU9wdGlvbnMpXG57XG5cdGlmICgob3B0aW9ucyA9IF9jcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZSwgb3B0aW9ucykpKVxuXHR7XG5cdFx0bGV0IHsgY3dkLCBtc2csIGF1dGhvciB9ID0gb3B0aW9ucztcblxuXHRcdGlmICghaXNHaXRSb290KGN3ZCkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogdGFyZ2V0IHBhdGggbm90IGEgZ2l0IHJvb3QgXCIke2N3ZH1cImApXG5cdFx0fVxuXG5cdFx0bGV0IG9wdHM6IFNwYXduT3B0aW9ucyA9IHtcblx0XHRcdGN3ZCxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9O1xuXG5cdFx0bGV0IGN1cnJlbnRfbmFtZSA9IGN1cnJlbnRCcmFuY2hOYW1lKGN3ZCk7XG5cblx0XHRpZiAoIW5vdEVtcHR5U3RyaW5nKGN1cnJlbnRfbmFtZSkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogY2FuJ3QgZ2V0IGN1cnJlbnQgYnJhbmNoIG5hbWVgKTtcblx0XHR9XG5cblx0XHRpZiAobG9jYWxCcmFuY2hFeGlzdHMobmV3X25hbWUsIGN3ZCkpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogdGFyZ2V0IGJyYW5jaCBcIiR7bmV3X25hbWV9XCIgYWxyZWFkeSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRsZXQgY3AgPSBjaGVja0dpdE91dHB1dChjcm9zc1NwYXduU3luYygnZ2l0JywgW1xuXHRcdFx0J2NoZWNrb3V0Jyxcblx0XHRcdCctLW9ycGhhbicsXG5cdFx0XHRuZXdfbmFtZSxcblx0XHRdLCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRsZXQgY3VycmVudF9uZXcgPSBjdXJyZW50QnJhbmNoTmFtZShjd2QpO1xuXG5cdFx0aWYgKGN1cnJlbnRfbmV3ID09PSBuZXdfbmFtZSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBicmFuY2ggXCIke25ld19uYW1lfVwiIGFscmVhZHkgZXhpc3RzLCBkZWxldGUgaXQgb3IgY2hhbmdlIGEgbmV3IG5hbWVgKTtcblx0XHR9XG5cblx0XHRpZiAoY3VycmVudF9uZXcgIT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiBzb21ldGhpbmcgd3JvbmcsIGV4cGVjdCBuZXcgYnJhbmNoIGlzIHVuZGVmaW5lZCwgYnV0IGdvdCBcIiR7Y3VycmVudF9uZXd9XCJgKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRsZXQgbW9kZV9hcmd2OiB1bmtub3duW107XG5cblx0XHRzd2l0Y2ggKG9wdGlvbnMubW9kZSlcblx0XHR7XG5cdFx0XHRjYXNlIGNyZWF0ZUVtcHR5QnJhbmNoLkVudW1Nb2RlLk9SUEhBTl9STTpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdybScsXG5cdFx0XHRcdFx0Jy1yJyxcblx0XHRcdFx0XHQnLicsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bW9kZV9hcmd2ID0gW1xuXHRcdFx0XHRcdCdyZXNldCcsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcobW9kZV9hcmd2KTtcblxuXHRcdGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIG1vZGVfYXJndiwgb3B0cyksIHRydWUpO1xuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdFx0aWYgKCFtc2cgfHwgIW5vdEVtcHR5U3RyaW5nKG1zZyA9IFN0cmluZyhtc2cpKSlcblx0XHR7XG5cdFx0XHRtc2cgPSBkZWZhdWx0TWVzc2FnZVxuXHRcdH1cblxuXHRcdGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIGZpbHRlckNyb3NzU3Bhd25Bcmd2KFtcblx0XHRcdCdjb21taXQnLFxuXHRcdFx0bm90RW1wdHlTdHJpbmcoYXV0aG9yKSA/IGAtLWF1dGhvcj0ke2F1dGhvcn1gIDogbnVsbCxcblx0XHRcdCctLWFsbG93LWVtcHR5Jyxcblx0XHRcdCctbScsXG5cdFx0XHRtc2csXG5cdFx0XSksIG9wdHMpLCB0cnVlKTtcblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdGxldCBjdXJyZW50X25ldzIgPSBjdXJyZW50QnJhbmNoTmFtZShjd2QpO1xuXG5cdFx0aWYgKGN1cnJlbnRfbmV3MiAhPT0gbmV3X25hbWUpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogY3VycmVudCBicmFuY2ggXCIke2N1cnJlbnRfbmV3Mn1cIiBzaG91bGQgc2FtZSBhcyBcIiR7bmV3X25hbWV9XCJgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY3dkO1xuXHR9XG59XG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBjcmVhdGVFbXB0eUJyYW5jaFxue1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG5cdHtcblx0XHQvKipcblx0XHQgKiDopoHlu7rnq4vnqbrnmb3liIbmlK/nmoQgZ2l0IHJlcG8g6Lev5b6R77yM5Y+q5YWB6Kix5qC555uu6YyEXG5cdFx0ICovXG5cdFx0Y3dkPzogc3RyaW5nLFxuXHRcdC8qKlxuXHRcdCAqIOa4heeQhuaqlOahiOeahOaooeW8j1xuXHRcdCAqL1xuXHRcdG1vZGU/OiBFbnVtTW9kZSxcblx0XHQvKipcblx0XHQgKiDoqK3lrpogY29tbWl0IOeahCDoqIrmga9cblx0XHQgKi9cblx0XHRtc2c/OiBzdHJpbmcsXG5cdFx0LyoqXG5cdFx0ICog6Kit5a6aIGNvbW1pdCDnmoQgYXV0aG9yXG5cdFx0ICovXG5cdFx0YXV0aG9yPzogc3RyaW5nLFxuXHR9XG5cblx0ZXhwb3J0IGNvbnN0IGVudW0gRW51bU1vZGVcblx0e1xuXHRcdC8qKlxuXHRcdCAqIOmgkOioreaooeW8jyDmr5TovIPlv6sg5LiN56e76Zmk5qqU5qGIIOWPquaTjeS9nCBHSVQg57SA6YyEXG5cdFx0ICovXG5cdFx0T1JQSEFOID0gMCxcblx0XHQvKipcblx0XHQgKiDmnIPnp7vpmaTmqpTmoYhcblx0XHQgKi9cblx0XHRPUlBIQU5fUk0gPSAxLFxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVtcHR5QnJhbmNoXG5cbmZ1bmN0aW9uIF9jcmVhdGVFbXB0eUJyYW5jaChuZXdfbmFtZTogc3RyaW5nLCBvcHRpb25zOiBjcmVhdGVFbXB0eUJyYW5jaC5JT3B0aW9ucylcbntcblx0aWYgKG5vdEVtcHR5U3RyaW5nKG5ld19uYW1lKSlcblx0e1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0bGV0IHsgY3dkID0gcHJvY2Vzcy5jd2QoKSB9ID0gb3B0aW9ucztcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhjd2QpICYmIChjd2QgPSBmcy5yZWFscGF0aFN5bmMoY3dkKSkpXG5cdFx0e1xuXHRcdFx0b3B0aW9ucy5jd2QgPSBjd2Q7XG5cblx0XHRcdHJldHVybiBvcHRpb25zO1xuXHRcdH1cblx0fVxufVxuIl19