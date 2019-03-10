"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
/**
 * 取得目前分支名稱
 */
function currentBranchName(REPO_PATH) {
    let cp = git_1.crossSpawnSync('git', [
        'rev-parse',
        '--abbrev-ref',
        'HEAD',
    ], {
        cwd: REPO_PATH,
    });
    cp = git_1.checkGitOutput(cp);
    if (!cp.error) {
        let name = util_2.crossSpawnOutput(cp.stdout);
        if (util_1.notEmptyString(name) && !/\s/.test(name)) {
            return name;
        }
    }
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
}
exports.currentBranchName = currentBranchName;
exports.default = currentBranchName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVudC1uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VycmVudC1uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBRXZELG9EQUE2RDtBQUU3RDs7R0FFRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLFNBQWlCO0lBRWxELElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsS0FBSyxFQUFFO1FBQzlCLFdBQVc7UUFDWCxjQUFjO1FBQ2QsTUFBTTtLQUNOLEVBQUU7UUFDRixHQUFHLEVBQUUsU0FBUztLQUNkLENBQUMsQ0FBQztJQUVILEVBQUUsR0FBRyxvQkFBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUNiO1FBQ0MsSUFBSSxJQUFJLEdBQUcsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZDLElBQUkscUJBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzVDO1lBQ0MsT0FBTyxJQUFJLENBQUM7U0FDWjtLQUNEO0lBRUQsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQXZCRCw4Q0F1QkM7QUFFRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjcm9zc1NwYXduU3luYywgY3Jvc3NTcGF3bkFzeW5jLCBTcGF3bk9wdGlvbnMsIGNoZWNrR2l0T3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IGRlYnVnLCBub3RFbXB0eVN0cmluZyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsJztcbmltcG9ydCB7IGlzR2l0Um9vdCB9IGZyb20gJ2dpdC1yb290Mic7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vdXRpbCc7XG5cbi8qKlxuICog5Y+W5b6X55uu5YmN5YiG5pSv5ZCN56ixXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXJyZW50QnJhbmNoTmFtZShSRVBPX1BBVEg6IHN0cmluZylcbntcblx0bGV0IGNwID0gY3Jvc3NTcGF3blN5bmMoJ2dpdCcsIFtcblx0XHQncmV2LXBhcnNlJyxcblx0XHQnLS1hYmJyZXYtcmVmJyxcblx0XHQnSEVBRCcsXG5cdF0sIHtcblx0XHRjd2Q6IFJFUE9fUEFUSCxcblx0fSk7XG5cblx0Y3AgPSBjaGVja0dpdE91dHB1dChjcCk7XG5cblx0aWYgKCFjcC5lcnJvcilcblx0e1xuXHRcdGxldCBuYW1lID0gY3Jvc3NTcGF3bk91dHB1dChjcC5zdGRvdXQpO1xuXG5cdFx0aWYgKG5vdEVtcHR5U3RyaW5nKG5hbWUpICYmICEvXFxzLy50ZXN0KG5hbWUpKVxuXHRcdHtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fVxuXG5cdGRlYnVnLmVuYWJsZWQgJiYgZGVidWcoY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3VycmVudEJyYW5jaE5hbWVcbiJdfQ==