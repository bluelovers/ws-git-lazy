"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVudC1uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VycmVudC1uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBRXZELG9EQUE2RDtBQUU3RCxTQUFnQixpQkFBaUIsQ0FBQyxTQUFpQjtJQUVsRCxJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLEtBQUssRUFBRTtRQUM5QixXQUFXO1FBQ1gsY0FBYztRQUNkLE1BQU07S0FDTixFQUFFO1FBQ0YsR0FBRyxFQUFFLFNBQVM7S0FDZCxDQUFDLENBQUM7SUFFSCxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV4QixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFDYjtRQUNDLElBQUksSUFBSSxHQUFHLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QyxJQUFJLHFCQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM1QztZQUNDLE9BQU8sSUFBSSxDQUFDO1NBQ1o7S0FDRDtJQUVELFlBQUssQ0FBQyxPQUFPLElBQUksWUFBSyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUF2QkQsOENBdUJDO0FBRUQsa0JBQWUsaUJBQWlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzMvMTAuXG4gKi9cblxuaW1wb3J0IHsgY3Jvc3NTcGF3blN5bmMsIGNyb3NzU3Bhd25Bc3luYywgU3Bhd25PcHRpb25zLCBjaGVja0dpdE91dHB1dCB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL2dpdCc7XG5pbXBvcnQgeyBkZWJ1Zywgbm90RW1wdHlTdHJpbmcgfSBmcm9tICdAZ2l0LWxhenkvdXRpbCc7XG5pbXBvcnQgeyBpc0dpdFJvb3QgfSBmcm9tICdnaXQtcm9vdDInO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudEJyYW5jaE5hbWUoUkVQT19QQVRIOiBzdHJpbmcpXG57XG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBbXG5cdFx0J3Jldi1wYXJzZScsXG5cdFx0Jy0tYWJicmV2LXJlZicsXG5cdFx0J0hFQUQnLFxuXHRdLCB7XG5cdFx0Y3dkOiBSRVBPX1BBVEgsXG5cdH0pO1xuXG5cdGNwID0gY2hlY2tHaXRPdXRwdXQoY3ApO1xuXG5cdGlmICghY3AuZXJyb3IpXG5cdHtcblx0XHRsZXQgbmFtZSA9IGNyb3NzU3Bhd25PdXRwdXQoY3Auc3Rkb3V0KTtcblxuXHRcdGlmIChub3RFbXB0eVN0cmluZyhuYW1lKSAmJiAhL1xccy8udGVzdChuYW1lKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH1cblxuXHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1cnJlbnRCcmFuY2hOYW1lXG4iXX0=