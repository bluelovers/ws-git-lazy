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
function createEmptyBranch(old_name, new_name, options) {
    if ((options = _createEmptyBranch(old_name, new_name, options))) {
        let { cwd, msg, author } = options;
        if (!git_root2_1.isGitRoot(cwd)) {
            throw new Error(`fatal: target path not a git root "${cwd}"`);
        }
        let opts = {
            cwd,
        };
        let current_name = current_name_1.default(cwd);
        if (util_1.notEmptyString(current_name)) {
            throw new Error(`fatal: can't get current branch name`);
        }
        let cp = git_1.checkGitOutput(git_1.crossSpawnSync('git', [
            'checkout',
            '--no-track',
            '--orphan',
            new_name,
        ], opts), true);
        let current_new = current_name_1.default(cwd);
        if (current_new !== new_name) {
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
function _createEmptyBranch(old_name, new_name, options) {
    if (util_1.notEmptyString(old_name) && util_1.notEmptyString(new_name) && old_name !== new_name) {
        options = options || {};
        let { cwd = process.cwd() } = options;
        if (util_1.notEmptyString(cwd) && (cwd = fs.realpathSync(cwd))) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLWVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBQ3ZELHlDQUFzQztBQUN0QyxvREFBbUY7QUFDbkYsaURBQStDO0FBQy9DLHlCQUEwQjtBQUUxQixNQUFNLGNBQWMsR0FBRyxpQ0FBaUMsQ0FBQztBQUV6RCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsT0FBb0M7SUFFekcsSUFBSSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQy9EO1FBQ0MsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRW5DLElBQUksQ0FBQyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxFQUNuQjtZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUE7U0FDN0Q7UUFFRCxJQUFJLElBQUksR0FBaUI7WUFDeEIsR0FBRztTQUNILENBQUM7UUFFRixJQUFJLFlBQVksR0FBRyxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLHFCQUFjLENBQUMsWUFBWSxDQUFDLEVBQ2hDO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxvQkFBYyxDQUFDLEtBQUssRUFBRTtZQUM3QyxVQUFVO1lBQ1YsWUFBWTtZQUNaLFVBQVU7WUFDVixRQUFRO1NBQ1IsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoQixJQUFJLFdBQVcsR0FBRyxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6QyxJQUFJLFdBQVcsS0FBSyxRQUFRLEVBQzVCO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsUUFBUSxrQkFBa0IsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUM3RjtRQUVELFlBQUssQ0FBQyxPQUFPLElBQUksWUFBSyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksU0FBb0IsQ0FBQztRQUV6QixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQ3BCO1lBQ0M7Z0JBQ0MsU0FBUyxHQUFHO29CQUNYLElBQUk7b0JBQ0osSUFBSTtvQkFDSixHQUFHO2lCQUNILENBQUM7Z0JBQ0YsTUFBTTtZQUNQO2dCQUNDLFNBQVMsR0FBRztvQkFDWCxPQUFPO2lCQUNQLENBQUM7Z0JBQ0YsTUFBTTtTQUNQO1FBRUQsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbEMsRUFBRSxHQUFHLG9CQUFjLENBQUMsb0JBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxFLFlBQUssQ0FBQyxPQUFPLElBQUksWUFBSyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxxQkFBYyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDOUM7WUFDQyxHQUFHLEdBQUcsY0FBYyxDQUFBO1NBQ3BCO1FBRUQsRUFBRSxHQUFHLG9CQUFjLENBQUMsb0JBQWMsQ0FBQyxLQUFLLEVBQUUsMkJBQW9CLENBQUM7WUFDOUQsUUFBUTtZQUNSLHFCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDcEQsZUFBZTtZQUNmLElBQUk7WUFDSixHQUFHO1NBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpCLFlBQUssQ0FBQyxPQUFPLElBQUksWUFBSyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXBELE9BQU8sR0FBRyxDQUFDO0tBQ1g7QUFDRixDQUFDO0FBL0VELDhDQStFQztBQW1CRCxrQkFBZSxpQkFBaUIsQ0FBQTtBQUVoQyxTQUFTLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxPQUFtQztJQUVsRyxJQUFJLHFCQUFjLENBQUMsUUFBUSxDQUFDLElBQUkscUJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLEtBQUssUUFBUSxFQUNqRjtRQUNDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXhCLElBQUksRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXRDLElBQUkscUJBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ3ZEO1lBQ0MsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFbEIsT0FBTyxPQUFPLENBQUM7U0FDZjtLQUNEO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjcm9zc1NwYXduU3luYywgY3Jvc3NTcGF3bkFzeW5jLCBTcGF3bk9wdGlvbnMsIGNoZWNrR2l0T3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IG5vdEVtcHR5U3RyaW5nLCBkZWJ1ZyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsJztcbmltcG9ydCB7IGlzR2l0Um9vdCB9IGZyb20gJ2dpdC1yb290Mic7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0LCBmaWx0ZXJDcm9zc1NwYXduQXJndiB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuaW1wb3J0IGN1cnJlbnRCcmFuY2hOYW1lIGZyb20gJy4vY3VycmVudC1uYW1lJztcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmNvbnN0IGRlZmF1bHRNZXNzYWdlID0gJ2NyZWF0ZSBlbXB0eSBicmFuY2ggYnkgZ2l0LWxhenknO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlCcmFuY2gob2xkX25hbWU6IHN0cmluZywgbmV3X25hbWU6IHN0cmluZywgb3B0aW9ucz86IGNyZWF0ZUVtcHR5QnJhbmNoLklPcHRpb25zKVxue1xuXHRpZiAoKG9wdGlvbnMgPSBfY3JlYXRlRW1wdHlCcmFuY2gob2xkX25hbWUsIG5ld19uYW1lLCBvcHRpb25zKSkpXG5cdHtcblx0XHRsZXQgeyBjd2QsIG1zZywgYXV0aG9yIH0gPSBvcHRpb25zO1xuXG5cdFx0aWYgKCFpc0dpdFJvb3QoY3dkKSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGZhdGFsOiB0YXJnZXQgcGF0aCBub3QgYSBnaXQgcm9vdCBcIiR7Y3dkfVwiYClcblx0XHR9XG5cblx0XHRsZXQgb3B0czogU3Bhd25PcHRpb25zID0ge1xuXHRcdFx0Y3dkLFxuXHRcdH07XG5cblx0XHRsZXQgY3VycmVudF9uYW1lID0gY3VycmVudEJyYW5jaE5hbWUoY3dkKTtcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhjdXJyZW50X25hbWUpKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmF0YWw6IGNhbid0IGdldCBjdXJyZW50IGJyYW5jaCBuYW1lYCk7XG5cdFx0fVxuXG5cdFx0bGV0IGNwID0gY2hlY2tHaXRPdXRwdXQoY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIFtcblx0XHRcdCdjaGVja291dCcsXG5cdFx0XHQnLS1uby10cmFjaycsXG5cdFx0XHQnLS1vcnBoYW4nLFxuXHRcdFx0bmV3X25hbWUsXG5cdFx0XSwgb3B0cyksIHRydWUpO1xuXG5cdFx0bGV0IGN1cnJlbnRfbmV3ID0gY3VycmVudEJyYW5jaE5hbWUoY3dkKTtcblxuXHRcdGlmIChjdXJyZW50X25ldyAhPT0gbmV3X25hbWUpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYXRhbDogY2FuJ3QgY3JlYXRlIG5ldyBicmFuY2ggXCIke25ld19uYW1lfVwiLCBjdXJyZW50IGlzIFwiJHtjdXJyZW50X25ld31cImApO1xuXHRcdH1cblxuXHRcdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdGxldCBtb2RlX2FyZ3Y6IHVua25vd25bXTtcblxuXHRcdHN3aXRjaCAob3B0aW9ucy5tb2RlKVxuXHRcdHtcblx0XHRcdGNhc2UgY3JlYXRlRW1wdHlCcmFuY2guRW51bU1vZGUuT1JQSEFOX1JNOlxuXHRcdFx0XHRtb2RlX2FyZ3YgPSBbXG5cdFx0XHRcdFx0J3JtJyxcblx0XHRcdFx0XHQnLXInLFxuXHRcdFx0XHRcdCcuJyxcblx0XHRcdFx0XTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRtb2RlX2FyZ3YgPSBbXG5cdFx0XHRcdFx0J3Jlc2V0Jyxcblx0XHRcdFx0XTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhtb2RlX2FyZ3YpO1xuXG5cdFx0Y3AgPSBjaGVja0dpdE91dHB1dChjcm9zc1NwYXduU3luYygnZ2l0JywgbW9kZV9hcmd2LCBvcHRzKSwgdHJ1ZSk7XG5cblx0XHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0XHRpZiAoIW1zZyB8fCAhbm90RW1wdHlTdHJpbmcobXNnID0gU3RyaW5nKG1zZykpKVxuXHRcdHtcblx0XHRcdG1zZyA9IGRlZmF1bHRNZXNzYWdlXG5cdFx0fVxuXG5cdFx0Y3AgPSBjaGVja0dpdE91dHB1dChjcm9zc1NwYXduU3luYygnZ2l0JywgZmlsdGVyQ3Jvc3NTcGF3bkFyZ3YoW1xuXHRcdFx0J2NvbW1pdCcsXG5cdFx0XHRub3RFbXB0eVN0cmluZyhhdXRob3IpID8gYC0tYXV0aG9yPSR7YXV0aG9yfWAgOiBudWxsLFxuXHRcdFx0Jy0tYWxsb3ctZW1wdHknLFxuXHRcdFx0Jy1tJyxcblx0XHRcdG1zZyxcblx0XHRdKSwgb3B0cyksIHRydWUpO1xuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdFx0cmV0dXJuIGN3ZDtcblx0fVxufVxuXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgY3JlYXRlRW1wdHlCcmFuY2hcbntcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1xuXHR7XG5cdFx0Y3dkPzogc3RyaW5nLFxuXHRcdG1vZGU/OiBFbnVtTW9kZSxcblx0XHRtc2c/OiBzdHJpbmcsXG5cdFx0YXV0aG9yPzogc3RyaW5nLFxuXHR9XG5cblx0ZXhwb3J0IGNvbnN0IGVudW0gRW51bU1vZGVcblx0e1xuXHRcdE9SUEhBTiA9IDAsXG5cdFx0T1JQSEFOX1JNID0gMSxcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbXB0eUJyYW5jaFxuXG5mdW5jdGlvbiBfY3JlYXRlRW1wdHlCcmFuY2gob2xkX25hbWU6IHN0cmluZywgbmV3X25hbWU6IHN0cmluZywgb3B0aW9uczogY3JlYXRlRW1wdHlCcmFuY2guSU9wdGlvbnMpXG57XG5cdGlmIChub3RFbXB0eVN0cmluZyhvbGRfbmFtZSkgJiYgbm90RW1wdHlTdHJpbmcobmV3X25hbWUpICYmIG9sZF9uYW1lICE9PSBuZXdfbmFtZSlcblx0e1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0bGV0IHsgY3dkID0gcHJvY2Vzcy5jd2QoKSB9ID0gb3B0aW9ucztcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhjd2QpICYmIChjd2QgPSBmcy5yZWFscGF0aFN5bmMoY3dkKSkpXG5cdFx0e1xuXHRcdFx0b3B0aW9ucy5jd2QgPSBjd2Q7XG5cblx0XHRcdHJldHVybiBvcHRpb25zO1xuXHRcdH1cblx0fVxufVxuIl19