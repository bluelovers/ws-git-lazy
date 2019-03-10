"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2019/3/10.
 */
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("@git-lazy/util");
const util_2 = require("@git-lazy/util/spawn/util");
const fs = require("fs");
function renameRemoteBranch(remote, old_name, new_name, options) {
    if (options = _check_before(remote, old_name, new_name, options)) {
        let { cwd } = options;
        let cp = git_1.crossSpawnSync('git', [
            'push',
            remote,
            `${remote}/${old_name}:${new_name}`,
            `:${old_name}`,
        ], {
            cwd,
        });
        if (!cp.error) {
            console.log(util_2.crossSpawnOutput(cp.output));
            return true;
        }
        util_1.debug.enabled && util_1.debug(util_2.crossSpawnOutput(cp.output));
    }
}
exports.renameRemoteBranch = renameRemoteBranch;
exports.default = renameRemoteBranch;
function _check_before(remote, old_name, new_name, options) {
    if (util_1.notEmptyString(remote) && util_1.notEmptyString(old_name) && util_1.notEmptyString(new_name) && old_name !== new_name) {
        options = options || {};
        let { cwd = process.cwd() } = options;
        if (util_1.notEmptyString(cwd) && (cwd = fs.realpathSync(cwd))) {
            options.cwd = cwd;
            return options;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLXJlbW90ZS1icmFuY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5hbWUtcmVtb3RlLWJyYW5jaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUg7O0dBRUc7QUFFSCxrREFBeUc7QUFDekcseUNBQXVEO0FBRXZELG9EQUFtRjtBQUNuRix5QkFBMEI7QUFHMUIsU0FBZ0Isa0JBQWtCLENBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxPQUFxQztJQUUzSCxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQ2hFO1FBQ0MsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUV0QixJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLEtBQUssRUFBRTtZQUM5QixNQUFNO1lBQ04sTUFBTTtZQUNOLEdBQUcsTUFBTSxJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFDbkMsSUFBSSxRQUFRLEVBQUU7U0FDZCxFQUFFO1lBQ0YsR0FBRztTQUNILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUNiO1lBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUV6QyxPQUFPLElBQUksQ0FBQztTQUNaO1FBRUQsWUFBSyxDQUFDLE9BQU8sSUFBSSxZQUFLLENBQUMsdUJBQWdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDcEQ7QUFDRixDQUFDO0FBeEJELGdEQXdCQztBQWVELGtCQUFlLGtCQUFrQixDQUFBO0FBRWpDLFNBQVMsYUFBYSxDQUFDLE1BQWMsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsT0FBcUM7SUFFL0csSUFBSSxxQkFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHFCQUFjLENBQUMsUUFBUSxDQUFDLElBQUkscUJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLEtBQUssUUFBUSxFQUMzRztRQUNDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXhCLElBQUksRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXRDLElBQUkscUJBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ3ZEO1lBQ0MsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFbEIsT0FBTyxPQUFPLENBQUM7U0FDZjtLQUNEO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzMvMTAuXG4gKi9cblxuaW1wb3J0IHsgY3Jvc3NTcGF3blN5bmMsIGNyb3NzU3Bhd25Bc3luYywgU3Bhd25PcHRpb25zLCBjaGVja0dpdE91dHB1dCB9IGZyb20gJ0BnaXQtbGF6eS91dGlsL3NwYXduL2dpdCc7XG5pbXBvcnQgeyBub3RFbXB0eVN0cmluZywgZGVidWcgfSBmcm9tICdAZ2l0LWxhenkvdXRpbCc7XG5pbXBvcnQgeyBpc0dpdFJvb3QgfSBmcm9tICdnaXQtcm9vdDInO1xuaW1wb3J0IHsgY3Jvc3NTcGF3bk91dHB1dCwgZmlsdGVyQ3Jvc3NTcGF3bkFyZ3YgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi91dGlsJztcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgY3JlYXRlRW1wdHlCcmFuY2ggZnJvbSAnQGdpdC1sYXp5L2JyYW5jaC9saWIvY3JlYXRlLWVtcHR5JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmFtZVJlbW90ZUJyYW5jaChyZW1vdGU6IHN0cmluZywgb2xkX25hbWU6IHN0cmluZywgbmV3X25hbWU6IHN0cmluZywgb3B0aW9ucz86IHJlbmFtZVJlbW90ZUJyYW5jaC5JT3B0aW9ucylcbntcblx0aWYgKG9wdGlvbnMgPSBfY2hlY2tfYmVmb3JlKHJlbW90ZSwgb2xkX25hbWUsIG5ld19uYW1lLCBvcHRpb25zKSlcblx0e1xuXHRcdGxldCB7IGN3ZCB9ID0gb3B0aW9ucztcblxuXHRcdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKCdnaXQnLCBbXG5cdFx0XHQncHVzaCcsXG5cdFx0XHRyZW1vdGUsXG5cdFx0XHRgJHtyZW1vdGV9LyR7b2xkX25hbWV9OiR7bmV3X25hbWV9YCxcblx0XHRcdGA6JHtvbGRfbmFtZX1gLFxuXHRcdF0sIHtcblx0XHRcdGN3ZCxcblx0XHR9KTtcblxuXHRcdGlmICghY3AuZXJyb3IpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coY3Jvc3NTcGF3bk91dHB1dChjcC5vdXRwdXQpKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZGVidWcuZW5hYmxlZCAmJiBkZWJ1Zyhjcm9zc1NwYXduT3V0cHV0KGNwLm91dHB1dCkpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSByZW5hbWVSZW1vdGVCcmFuY2hcbntcblxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG5cdHtcblx0XHQvKipcblx0XHQgKiDopoHlu7rnq4vnqbrnmb3liIbmlK/nmoQgZ2l0IHJlcG8g6Lev5b6R77yM5Y+q5YWB6Kix5qC555uu6YyEXG5cdFx0ICovXG5cdFx0Y3dkPzogc3RyaW5nLFxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVuYW1lUmVtb3RlQnJhbmNoXG5cbmZ1bmN0aW9uIF9jaGVja19iZWZvcmUocmVtb3RlOiBzdHJpbmcsIG9sZF9uYW1lOiBzdHJpbmcsIG5ld19uYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiByZW5hbWVSZW1vdGVCcmFuY2guSU9wdGlvbnMpXG57XG5cdGlmIChub3RFbXB0eVN0cmluZyhyZW1vdGUpICYmIG5vdEVtcHR5U3RyaW5nKG9sZF9uYW1lKSAmJiBub3RFbXB0eVN0cmluZyhuZXdfbmFtZSkgJiYgb2xkX25hbWUgIT09IG5ld19uYW1lKVxuXHR7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRsZXQgeyBjd2QgPSBwcm9jZXNzLmN3ZCgpIH0gPSBvcHRpb25zO1xuXG5cdFx0aWYgKG5vdEVtcHR5U3RyaW5nKGN3ZCkgJiYgKGN3ZCA9IGZzLnJlYWxwYXRoU3luYyhjd2QpKSlcblx0XHR7XG5cdFx0XHRvcHRpb25zLmN3ZCA9IGN3ZDtcblxuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XG5cdFx0fVxuXHR9XG59XG4iXX0=