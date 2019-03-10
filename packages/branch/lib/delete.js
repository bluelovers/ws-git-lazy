"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
const index_1 = require("@git-lazy/util/util/index");
function deleteBranch(REPO_PATH, name, force) {
    let cp = git_1.crossSpawnSync('git', [
        'branch',
        force === true ? '-D' : '-d',
        name,
    ], {
        cwd: index_1.getCWD(REPO_PATH, 1 /* FS */),
    });
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    if (!cp.error) {
        return true;
    }
}
exports.deleteBranch = deleteBranch;
exports.default = deleteBranch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCxrREFBMEQ7QUFDMUQseUNBQXVEO0FBQ3ZELG9EQUE2RDtBQUM3RCxxREFBbUQ7QUFFbkQsU0FBZ0IsWUFBWSxDQUFDLFNBQWlCLEVBQUUsSUFBWSxFQUFFLEtBQWU7SUFFNUUsSUFBSSxFQUFFLEdBQUcsb0JBQWMsQ0FBQyxLQUFLLEVBQUU7UUFDOUIsUUFBUTtRQUNSLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUM1QixJQUFJO0tBQ0osRUFBRTtRQUNGLEdBQUcsRUFBRSxjQUFNLENBQUMsU0FBUyxhQUF5QjtLQUM5QyxDQUFDLENBQUM7SUFFSCxZQUFLLENBQUMsT0FBTyxJQUFJLFlBQUssQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFDYjtRQUNDLE9BQU8sSUFBSSxDQUFDO0tBQ1o7QUFDRixDQUFDO0FBaEJELG9DQWdCQztBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjcm9zc1NwYXduU3luYyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL2dpdCc7XG5pbXBvcnQgeyBkZWJ1Zywgbm90RW1wdHlTdHJpbmcgfSBmcm9tICdAZ2l0LWxhenkvdXRpbCc7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vdXRpbCc7XG5pbXBvcnQgeyBnZXRDV0QgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC91dGlsL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJyYW5jaChSRVBPX1BBVEg6IHN0cmluZywgbmFtZTogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pXG57XG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBbXG5cdFx0J2JyYW5jaCcsXG5cdFx0Zm9yY2UgPT09IHRydWUgPyAnLUQnIDogJy1kJyxcblx0XHRuYW1lLFxuXHRdLCB7XG5cdFx0Y3dkOiBnZXRDV0QoUkVQT19QQVRILCBnZXRDV0QuRW51bVJlYWxQYXRoLkZTKSxcblx0fSk7XG5cblx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXG5cdGlmICghY3AuZXJyb3IpXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWxldGVCcmFuY2hcbiJdfQ==