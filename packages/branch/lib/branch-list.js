"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
function localBranchList(REPO_PATH) {
    let cp = git_1.crossSpawnSync('git', [
        'branch',
        '--list',
        '--format=%(refname)',
    ], {
        cwd: REPO_PATH,
    });
    cp = git_1.checkGitOutput(cp);
    if (!cp.error) {
        let out = util_2.crossSpawnOutput(cp.stdout, {
            clearEol: true,
            stripAnsi: true,
        });
        let ls = out.split(/\n/).map(function (s) {
            return s.trim();
        });
        if (ls.length) {
            return ls;
        }
    }
    util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    return [];
}
exports.localBranchList = localBranchList;
exports.default = localBranchList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmNoLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJicmFuY2gtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsa0RBQXlHO0FBQ3pHLHlDQUF1RDtBQUV2RCxvREFBbUY7QUFHbkYsU0FBZ0IsZUFBZSxDQUFDLFNBQWlCO0lBRWhELElBQUksRUFBRSxHQUFHLG9CQUFjLENBQUMsS0FBSyxFQUFFO1FBQzlCLFFBQVE7UUFDUixRQUFRO1FBQ1IscUJBQXFCO0tBQ3JCLEVBQUU7UUFDRixHQUFHLEVBQUUsU0FBUztLQUNkLENBQUMsQ0FBQztJQUVILEVBQUUsR0FBRyxvQkFBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUNiO1FBQ0MsSUFBSSxHQUFHLEdBQUcsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUNyQyxRQUFRLEVBQUUsSUFBSTtZQUNkLFNBQVMsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBRXZDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUNiO1lBQ0MsT0FBTyxFQUFFLENBQUE7U0FDVDtLQUNEO0lBRUQsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFFcEQsT0FBTyxFQUFFLENBQUM7QUFDWCxDQUFDO0FBakNELDBDQWlDQztBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG5pbXBvcnQgeyBjcm9zc1NwYXduU3luYywgY3Jvc3NTcGF3bkFzeW5jLCBTcGF3bk9wdGlvbnMsIGNoZWNrR2l0T3V0cHV0IH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IG5vdEVtcHR5U3RyaW5nLCBkZWJ1ZyB9IGZyb20gJ0BnaXQtbGF6eS91dGlsJztcbmltcG9ydCB7IGlzR2l0Um9vdCB9IGZyb20gJ2dpdC1yb290Mic7XG5pbXBvcnQgeyBjcm9zc1NwYXduT3V0cHV0LCBmaWx0ZXJDcm9zc1NwYXduQXJndiB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL3V0aWwnO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsQnJhbmNoTGlzdChSRVBPX1BBVEg6IHN0cmluZyk6IHN0cmluZ1tdXG57XG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBbXG5cdFx0J2JyYW5jaCcsXG5cdFx0Jy0tbGlzdCcsXG5cdFx0Jy0tZm9ybWF0PSUocmVmbmFtZSknLFxuXHRdLCB7XG5cdFx0Y3dkOiBSRVBPX1BBVEgsXG5cdH0pO1xuXG5cdGNwID0gY2hlY2tHaXRPdXRwdXQoY3ApO1xuXG5cdGlmICghY3AuZXJyb3IpXG5cdHtcblx0XHRsZXQgb3V0ID0gY3Jvc3NTcGF3bk91dHB1dChjcC5zdGRvdXQsIHtcblx0XHRcdGNsZWFyRW9sOiB0cnVlLFxuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdH0pO1xuXG5cdFx0bGV0IGxzID0gb3V0LnNwbGl0KC9cXG4vKS5tYXAoZnVuY3Rpb24gKHMpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHMudHJpbSgpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGxzLmxlbmd0aClcblx0XHR7XG5cdFx0XHRyZXR1cm4gbHNcblx0XHR9XG5cdH1cblxuXHRkZWJ1Zy5lbmFibGVkICYmIGRlYnVnKGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KSk7XG5cblx0cmV0dXJuIFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsb2NhbEJyYW5jaExpc3RcbiJdfQ==