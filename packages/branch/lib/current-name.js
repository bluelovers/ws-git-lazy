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
    if (!cp.error) {
        let name = util_2.crossSpawnOutput(cp.stdout, {
            clearEol: true,
            stripAnsi: true,
        });
        if (util_1.notEmptyString(name) && !/\s/.test(name)) {
            return name;
        }
    }
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
}
exports.currentBranchName = currentBranchName;
exports.default = currentBranchName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVudC1uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VycmVudC1uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBRXZELG9EQUF3RTtBQUV4RTs7R0FFRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLFNBQWlCO0lBRWxELElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsS0FBSyxFQUFFO1FBQzlCLFdBQVc7UUFDWCxjQUFjO1FBQ2QsTUFBTTtLQUNOLEVBQUU7UUFDRixHQUFHLEVBQUUsU0FBUztLQUNkLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUNiO1FBQ0MsSUFBSSxJQUFJLEdBQUcsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUN0QyxRQUFRLEVBQUUsSUFBSTtZQUNkLFNBQVMsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDNUM7WUFDQyxPQUFPLElBQUksQ0FBQztTQUNaO0tBQ0Q7SUFFRCxZQUFLLENBQUMsT0FBTyxJQUFJLFlBQUssQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBeEJELDhDQXdCQztBQUVELGtCQUFlLGlCQUFpQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8zLzEwLlxuICovXG5cbmltcG9ydCB7IGNyb3NzU3Bhd25TeW5jLCBjcm9zc1NwYXduQXN5bmMsIFNwYXduT3B0aW9ucywgY2hlY2tHaXRPdXRwdXQgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi9naXQnO1xuaW1wb3J0IHsgZGVidWcsIG5vdEVtcHR5U3RyaW5nIH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwnO1xuaW1wb3J0IHsgaXNHaXRSb290IH0gZnJvbSAnZ2l0LXJvb3QyJztcbmltcG9ydCB7IGNyb3NzU3Bhd25PdXRwdXQsIHN0cmlwQW5zaSB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuXG4vKipcbiAqIOWPluW+l+ebruWJjeWIhuaUr+WQjeeosVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudEJyYW5jaE5hbWUoUkVQT19QQVRIOiBzdHJpbmcpXG57XG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBbXG5cdFx0J3Jldi1wYXJzZScsXG5cdFx0Jy0tYWJicmV2LXJlZicsXG5cdFx0J0hFQUQnLFxuXHRdLCB7XG5cdFx0Y3dkOiBSRVBPX1BBVEgsXG5cdH0pO1xuXG5cdGlmICghY3AuZXJyb3IpXG5cdHtcblx0XHRsZXQgbmFtZSA9IGNyb3NzU3Bhd25PdXRwdXQoY3Auc3Rkb3V0LCB7XG5cdFx0XHRjbGVhckVvbDogdHJ1ZSxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9KTtcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhuYW1lKSAmJiAhL1xccy8udGVzdChuYW1lKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH1cblxuXHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1cnJlbnRCcmFuY2hOYW1lXG4iXX0=