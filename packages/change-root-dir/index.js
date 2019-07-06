"use strict";
/**
 * Created by user on 2019/7/6.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@git-lazy/util/spawn/git");
const root_1 = require("@git-lazy/root");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const util_1 = require("@git-lazy/util/spawn/util");
/**
 * https://stackoverflow.com/a/11764065/4563339
 */
function gitChangeRootDir(options) {
    const { bin = 'git', cwd, yesDoIt, force, stdio = 'inherit' } = options;
    if (!root_1.isGitRoot(cwd)) {
        throw new RangeError(`cwd not a git root ${cwd}`);
    }
    if (!yesDoIt) {
        const msg = `options.yesDoIt must be true, this is unsafe action, make sure u backup all data`;
        throw new Error(msg);
    }
    let { targetPath } = options;
    let ls = fast_glob_1.default.sync([
        targetPath,
        '!**/.git',
    ], {
        cwd,
        onlyFiles: false,
        onlyDirectories: true,
    });
    if (ls.length != 1) {
        throw new RangeError(`targetPath is not allow, [${ls}], length: ${ls.length}`);
    }
    return targetPath
        .split('/')
        .map((targetPath) => {
        console.debug(`current: ${targetPath}`);
        return _core({
            bin,
            cwd,
            targetPath,
            force,
            stdio,
        });
    });
}
exports.gitChangeRootDir = gitChangeRootDir;
function _core(options) {
    const { bin = 'git', cwd, targetPath, force, stdio = 'inherit' } = options;
    if (typeof targetPath !== 'string' || targetPath === '') {
        throw new RangeError(`targetPath is not allow, '${targetPath}'`);
    }
    let cp = git_1.crossSpawnSync(bin, [
        'filter-branch',
        '--subdirectory-filter',
        targetPath,
        '--tag-name-filter',
        'cat',
        force ? '-f' : '',
        '--',
        '--all',
    ], {
        cwd,
        stripAnsi: true,
        stdio,
    });
    let msg = util_1.crossSpawnOutput(cp.output);
    if (/Cannot create a new backup/i.test(msg)) {
        throw new Error(msg);
    }
    else if (cp.error) {
        throw cp.error;
    }
    return cp;
}
exports._core = _core;
exports.default = gitChangeRootDir;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsa0RBQThGO0FBRTlGLHlDQUFtRDtBQUNuRCxzRUFBcUU7QUFFckUsb0RBQTZEO0FBZ0I3RDs7R0FFRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLE9BQWlCO0lBRWpELE1BQU0sRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFeEUsSUFBSSxDQUFDLGdCQUFTLENBQUMsR0FBRyxDQUFDLEVBQ25CO1FBQ0MsTUFBTSxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsQ0FBQTtLQUNqRDtJQUVELElBQUksQ0FBQyxPQUFPLEVBQ1o7UUFDQyxNQUFNLEdBQUcsR0FBRyxrRkFBa0YsQ0FBQztRQUUvRixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3BCO0lBRUQsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUU3QixJQUFJLEVBQUUsR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQztRQUN0QixVQUFVO1FBQ1YsVUFBVTtLQUNWLEVBQUU7UUFDRixHQUFHO1FBQ0gsU0FBUyxFQUFFLEtBQUs7UUFDaEIsZUFBZSxFQUFFLElBQUk7S0FDckIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFDbEI7UUFDQyxNQUFNLElBQUksVUFBVSxDQUFDLDZCQUE2QixFQUFFLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7S0FDOUU7SUFFRCxPQUFPLFVBQVU7U0FDZixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7UUFFbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFeEMsT0FBTyxLQUFLLENBQUM7WUFDWixHQUFHO1lBQ0gsR0FBRztZQUNILFVBQVU7WUFDVixLQUFLO1lBQ0wsS0FBSztTQUNMLENBQUMsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUNGO0FBQ0YsQ0FBQztBQS9DRCw0Q0ErQ0M7QUFFRCxTQUFnQixLQUFLLENBQUMsT0FBcUY7SUFFMUcsTUFBTSxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFNBQVMsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUUzRSxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsSUFBSSxVQUFVLEtBQUssRUFBRSxFQUN2RDtRQUNDLE1BQU0sSUFBSSxVQUFVLENBQUMsNkJBQTZCLFVBQVUsR0FBRyxDQUFDLENBQUE7S0FDaEU7SUFFRCxJQUFJLEVBQUUsR0FBRyxvQkFBYyxDQUFDLEdBQUcsRUFBRTtRQUM1QixlQUFlO1FBQ2YsdUJBQXVCO1FBQ3ZCLFVBQVU7UUFDVixtQkFBbUI7UUFDbkIsS0FBSztRQUNMLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2pCLElBQUk7UUFDSixPQUFPO0tBQ1AsRUFBRTtRQUNGLEdBQUc7UUFDSCxTQUFTLEVBQUUsSUFBSTtRQUNmLEtBQUs7S0FDTCxDQUFDLENBQUM7SUFFSCxJQUFJLEdBQUcsR0FBRyx1QkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsSUFBSSw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQzNDO1FBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNwQjtTQUNJLElBQUksRUFBRSxDQUFDLEtBQUssRUFDakI7UUFDQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUE7S0FDZDtJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQXBDRCxzQkFvQ0M7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNy82LlxuICovXG5cbmltcG9ydCB7IGNyb3NzU3Bhd25TeW5jLCBTcGF3blN5bmNPcHRpb25zLCBTcGF3blN5bmNSZXR1cm5zIH0gZnJvbSAnQGdpdC1sYXp5L3V0aWwvc3Bhd24vZ2l0JztcbmltcG9ydCB7IGhhbmRsZVNwYXduT3V0cHV0QXJyYXkgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi9kYXRhJztcbmltcG9ydCB7IGhhc0dpdCwgaXNHaXRSb290IH0gZnJvbSAnQGdpdC1sYXp5L3Jvb3QnO1xuaW1wb3J0IEZhc3RHbG9iLCB7IE9wdGlvbnMsIEVudHJ5SXRlbSB9IGZyb20gJ0BibHVlbG92ZXJzL2Zhc3QtZ2xvYic7XG5pbXBvcnQgeyBJVFNSZXF1aXJlZFdpdGggfSBmcm9tICd0cy10eXBlJztcbmltcG9ydCB7IGNyb3NzU3Bhd25PdXRwdXQgfSBmcm9tICdAZ2l0LWxhenkvdXRpbC9zcGF3bi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1xue1xuXHRjd2Q6IHN0cmluZyxcblx0dGFyZ2V0UGF0aDogc3RyaW5nLFxuXG5cdGJpbj86IHN0cmluZyxcblxuXHRmb3JjZT86IGJvb2xlYW4sXG5cblx0eWVzRG9JdD86IGJvb2xlYW4sXG5cblx0c3RkaW8/OiBTcGF3blN5bmNPcHRpb25zW1wic3RkaW9cIl0sXG59XG5cbi8qKlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExNzY0MDY1LzQ1NjMzMzlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdpdENoYW5nZVJvb3REaXIob3B0aW9uczogSU9wdGlvbnMpXG57XG5cdGNvbnN0IHsgYmluID0gJ2dpdCcsIGN3ZCwgeWVzRG9JdCwgZm9yY2UsIHN0ZGlvID0gJ2luaGVyaXQnIH0gPSBvcHRpb25zO1xuXG5cdGlmICghaXNHaXRSb290KGN3ZCkpXG5cdHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihgY3dkIG5vdCBhIGdpdCByb290ICR7Y3dkfWApXG5cdH1cblxuXHRpZiAoIXllc0RvSXQpXG5cdHtcblx0XHRjb25zdCBtc2cgPSBgb3B0aW9ucy55ZXNEb0l0IG11c3QgYmUgdHJ1ZSwgdGhpcyBpcyB1bnNhZmUgYWN0aW9uLCBtYWtlIHN1cmUgdSBiYWNrdXAgYWxsIGRhdGFgO1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKG1zZylcblx0fVxuXG5cdGxldCB7IHRhcmdldFBhdGggfSA9IG9wdGlvbnM7XG5cblx0bGV0IGxzID0gRmFzdEdsb2Iuc3luYyhbXG5cdFx0dGFyZ2V0UGF0aCxcblx0XHQnISoqLy5naXQnLFxuXHRdLCB7XG5cdFx0Y3dkLFxuXHRcdG9ubHlGaWxlczogZmFsc2UsXG5cdFx0b25seURpcmVjdG9yaWVzOiB0cnVlLFxuXHR9KTtcblxuXHRpZiAobHMubGVuZ3RoICE9IDEpXG5cdHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihgdGFyZ2V0UGF0aCBpcyBub3QgYWxsb3csIFske2xzfV0sIGxlbmd0aDogJHtscy5sZW5ndGh9YClcblx0fVxuXG5cdHJldHVybiB0YXJnZXRQYXRoXG5cdFx0LnNwbGl0KCcvJylcblx0XHQubWFwKCh0YXJnZXRQYXRoKSA9PlxuXHRcdHtcblx0XHRcdGNvbnNvbGUuZGVidWcoYGN1cnJlbnQ6ICR7dGFyZ2V0UGF0aH1gKTtcblxuXHRcdFx0cmV0dXJuIF9jb3JlKHtcblx0XHRcdFx0YmluLFxuXHRcdFx0XHRjd2QsXG5cdFx0XHRcdHRhcmdldFBhdGgsXG5cdFx0XHRcdGZvcmNlLFxuXHRcdFx0XHRzdGRpbyxcblx0XHRcdH0pXG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2NvcmUob3B0aW9uczogSVRTUmVxdWlyZWRXaXRoPElPcHRpb25zLCAndGFyZ2V0UGF0aCcgfCAnY3dkJyB8ICdmb3JjZScgfCAnc3RkaW8nIHwgJ2JpbicgPilcbntcblx0Y29uc3QgeyBiaW4gPSAnZ2l0JywgY3dkLCB0YXJnZXRQYXRoLCBmb3JjZSwgc3RkaW8gPSAnaW5oZXJpdCcgfSA9IG9wdGlvbnM7XG5cblx0aWYgKHR5cGVvZiB0YXJnZXRQYXRoICE9PSAnc3RyaW5nJyB8fCB0YXJnZXRQYXRoID09PSAnJylcblx0e1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKGB0YXJnZXRQYXRoIGlzIG5vdCBhbGxvdywgJyR7dGFyZ2V0UGF0aH0nYClcblx0fVxuXG5cdGxldCBjcCA9IGNyb3NzU3Bhd25TeW5jKGJpbiwgW1xuXHRcdCdmaWx0ZXItYnJhbmNoJyxcblx0XHQnLS1zdWJkaXJlY3RvcnktZmlsdGVyJyxcblx0XHR0YXJnZXRQYXRoLFxuXHRcdCctLXRhZy1uYW1lLWZpbHRlcicsXG5cdFx0J2NhdCcsXG5cdFx0Zm9yY2UgPyAnLWYnIDogJycsXG5cdFx0Jy0tJyxcblx0XHQnLS1hbGwnLFxuXHRdLCB7XG5cdFx0Y3dkLFxuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHRzdGRpbyxcblx0fSk7XG5cblx0bGV0IG1zZyA9IGNyb3NzU3Bhd25PdXRwdXQoY3Aub3V0cHV0KTtcblxuXHRpZiAoL0Nhbm5vdCBjcmVhdGUgYSBuZXcgYmFja3VwL2kudGVzdChtc2cpKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKG1zZylcblx0fVxuXHRlbHNlIGlmIChjcC5lcnJvcilcblx0e1xuXHRcdHRocm93IGNwLmVycm9yXG5cdH1cblxuXHRyZXR1cm4gY3A7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdpdENoYW5nZVJvb3REaXJcbiJdfQ==