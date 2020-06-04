"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crossSpawn = require("cross-spawn-extra");
const git_rev_range_1 = require("git-rev-range");
const path = require("upath2");
const crlf_normalize_1 = require("crlf-normalize");
const gitRoot = require("git-root2");
const git_decode_1 = require("git-decode");
exports.defaultOptions = {
    encoding: 'UTF-8',
};
function gitDiffFrom(from = 'HEAD', to = 'HEAD', options = {}) {
    if (typeof to === 'object' && to !== null) {
        [options, to] = [to, 'HEAD'];
    }
    options = Object.assign({}, exports.defaultOptions, options);
    let cwd = git_rev_range_1.getCwd(options.cwd);
    let root = gitRoot(cwd);
    if (!root) {
        throw new RangeError(`no exists git at ${cwd}`);
    }
    let opts2 = {
        cwd,
        realHash: true,
        gitlogOptions: {
            firstParent: true,
            displayFilesChangedDuringMerge: true,
        },
    };
    ({ from, to } = git_rev_range_1.revisionRangeData(from, to, opts2));
    let files = [];
    let list = [];
    if (from != to) {
        let log = crossSpawn.sync('git', filterArgv([
            ...'diff-tree -r --no-commit-id --name-status'.split(' '),
            `--encoding=${options.encoding}`,
            git_rev_range_1.revisionRange(from, to, opts2),
        ]), {
            //stdio: 'inherit',
            cwd,
            stripAnsi: true,
        });
        if (log.error || log.stderr.length) {
            throw new Error(log.stderr.toString());
        }
        list = crlf_normalize_1.crlf(log.stdout.toString())
            .split(crlf_normalize_1.LF)
            .reduce(function (a, line) {
            line = line.replace(/^\s+/g, '');
            if (line) {
                let [status, file] = line.split(/\t/);
                /**
                 * 沒有正確回傳 utf-8 而是變成編碼化
                 */
                file = git_decode_1.decode2(file);
                let fullpath = path.join(root, file);
                file = path.relative(root, fullpath);
                let row = {
                    status,
                    path: file,
                    fullpath,
                };
                files.push(file);
                a.push(row);
            }
            return a;
        }, []);
    }
    cwd = path.resolve(cwd);
    root = path.resolve(root);
    return Object.assign(list, {
        from,
        to,
        cwd,
        root,
        files,
    });
}
exports.gitDiffFrom = gitDiffFrom;
function filterArgv(argv) {
    return argv.filter(function (v) {
        return v !== null && v !== '';
    });
}
exports.filterArgv = filterArgv;
exports.default = gitDiffFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsZ0RBQWdEO0FBQ2hELGlEQUEySDtBQUMzSCwrQkFBK0I7QUFDL0IsbURBQTZEO0FBQzdELHFDQUFzQztBQUN0QywyQ0FBNkM7QUFRaEMsUUFBQSxjQUFjLEdBQWE7SUFDdkMsUUFBUSxFQUFFLE9BQU87Q0FDakIsQ0FBQztBQXVCRixTQUFnQixXQUFXLENBQUMsT0FBd0IsTUFBTSxFQUFFLEtBQW1CLE1BQU0sRUFBRSxVQUFvQixFQUFFO0lBRTVHLElBQUksT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQ3pDO1FBQ0MsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDN0I7SUFFRCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsc0JBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVyRCxJQUFJLEdBQUcsR0FBRyxzQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFXLENBQUM7SUFFbEMsSUFBSSxDQUFDLElBQUksRUFDVDtRQUNDLE1BQU0sSUFBSSxVQUFVLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDaEQ7SUFFRCxJQUFJLEtBQUssR0FBd0I7UUFDaEMsR0FBRztRQUNILFFBQVEsRUFBRSxJQUFJO1FBQ2QsYUFBYSxFQUFFO1lBQ2QsV0FBVyxFQUFFLElBQUk7WUFDakIsOEJBQThCLEVBQUUsSUFBSTtTQUNwQztLQUNELENBQUM7SUFFRixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLGlDQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVwRCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7SUFDekIsSUFBSSxJQUFJLEdBSUYsRUFBRSxDQUFDO0lBRVQsSUFBSSxJQUFJLElBQUksRUFBRSxFQUNkO1FBQ0MsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1lBQzNDLEdBQUcsMkNBQTJDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUN6RCxjQUFjLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDaEMsNkJBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQztTQUM5QixDQUFDLEVBQUU7WUFDSCxtQkFBbUI7WUFDbkIsR0FBRztZQUNILFNBQVMsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNsQztZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1NBQ3RDO1FBRUQsSUFBSSxHQUFHLHFCQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNoQyxLQUFLLENBQUMsbUJBQUUsQ0FBQzthQUNULE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBRXhCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVqQyxJQUFJLElBQUksRUFDUjtnQkFDQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRDOzttQkFFRztnQkFDSCxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFckMsSUFBSSxHQUFHLEdBQUc7b0JBQ1QsTUFBTTtvQkFDTixJQUFJLEVBQUUsSUFBSTtvQkFDVixRQUFRO2lCQUNSLENBQUM7Z0JBRUYsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUNYO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDVixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ047S0FDRDtJQUVELEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTFCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDMUIsSUFBSTtRQUNKLEVBQUU7UUFDRixHQUFHO1FBQ0gsSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBaEdELGtDQWdHQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxJQUFjO0lBRXhDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFN0IsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBTkQsZ0NBTUM7QUFFRCxrQkFBZSxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE4LzUvMTQvMDE0LlxuICovXG5cbmltcG9ydCAqIGFzIGNyb3NzU3Bhd24gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IHsgcmVzb2x2ZVJldmlzaW9uLCByZXZpc2lvblJhbmdlLCBnZXRDd2QsIHJldmlzaW9uUmFuZ2VEYXRhLCBJT3B0aW9ucyBhcyBJR2l0UmV2UmFuZ2VPcHRpb25zIH0gZnJvbSAnZ2l0LXJldi1yYW5nZSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3VwYXRoMic7XG5pbXBvcnQgeyBjcmxmLCBjaGtjcmxmLCBMRiwgQ1JMRiwgQ1IgfSBmcm9tICdjcmxmLW5vcm1hbGl6ZSc7XG5pbXBvcnQgZ2l0Um9vdCA9IHJlcXVpcmUoJ2dpdC1yb290MicpO1xuaW1wb3J0IHsgZGVjb2RlLCBkZWNvZGUyIH0gZnJvbSAnZ2l0LWRlY29kZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNcbntcblx0ZW5jb2Rpbmc/OiBzdHJpbmcsXG5cdGN3ZD86IHN0cmluZyxcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRPcHRpb25zOiBJT3B0aW9ucyA9IHtcblx0ZW5jb2Rpbmc6ICdVVEYtOCcsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElHaXREaWZmRnJvbVJvd1xue1xuXHRzdGF0dXM6IHN0cmluZyxcblx0cGF0aDogc3RyaW5nLFxuXHRmdWxscGF0aDogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBJR2l0RGlmZkZyb20gPSBBcnJheTxJR2l0RGlmZkZyb21Sb3c+ICYge1xuXHRmcm9tOiBzdHJpbmcsXG5cdHRvOiBzdHJpbmcsXG5cdGN3ZDogc3RyaW5nLFxuXHRyb290OiBzdHJpbmcsXG5cdGZpbGVzOiBzdHJpbmdbXSxcbn1cblxuLyoqXG4gKiBnaXQgZGlmZi10cmVlIC1yIC0tbm8tY29tbWl0LWlkIC0tbmFtZS1zdGF0dXMgLS1lbmNvZGluZz1VVEYtOCAgSEVBRH4xIEhFQURcbiAqL1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGZ1bmN0aW9uIGdpdERpZmZGcm9tKGZyb206IHN0cmluZyB8IG51bWJlciwgb3B0aW9ucz86IElPcHRpb25zKTogSUdpdERpZmZGcm9tXG5leHBvcnQgZnVuY3Rpb24gZ2l0RGlmZkZyb20oZnJvbTogc3RyaW5nIHwgbnVtYmVyLCB0bzogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMpOiBJR2l0RGlmZkZyb21cbmV4cG9ydCBmdW5jdGlvbiBnaXREaWZmRnJvbShmcm9tOiBzdHJpbmcgfCBudW1iZXIgPSAnSEVBRCcsIHRvOiBzdHJpbmcgfCBhbnkgPSAnSEVBRCcsIG9wdGlvbnM6IElPcHRpb25zID0ge30pXG57XG5cdGlmICh0eXBlb2YgdG8gPT09ICdvYmplY3QnICYmIHRvICE9PSBudWxsKVxuXHR7XG5cdFx0W29wdGlvbnMsIHRvXSA9IFt0bywgJ0hFQUQnXTtcblx0fVxuXG5cdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cblx0bGV0IGN3ZCA9IGdldEN3ZChvcHRpb25zLmN3ZCk7XG5cdGxldCByb290ID0gZ2l0Um9vdChjd2QpIGFzIHN0cmluZztcblxuXHRpZiAoIXJvb3QpXG5cdHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihgbm8gZXhpc3RzIGdpdCBhdCAke2N3ZH1gKTtcblx0fVxuXG5cdGxldCBvcHRzMjogSUdpdFJldlJhbmdlT3B0aW9ucyA9IHtcblx0XHRjd2QsXG5cdFx0cmVhbEhhc2g6IHRydWUsXG5cdFx0Z2l0bG9nT3B0aW9uczoge1xuXHRcdFx0Zmlyc3RQYXJlbnQ6IHRydWUsXG5cdFx0XHRkaXNwbGF5RmlsZXNDaGFuZ2VkRHVyaW5nTWVyZ2U6IHRydWUsXG5cdFx0fSxcblx0fTtcblxuXHQoeyBmcm9tLCB0byB9ID0gcmV2aXNpb25SYW5nZURhdGEoZnJvbSwgdG8sIG9wdHMyKSk7XG5cblx0bGV0IGZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRsZXQgbGlzdDoge1xuXHRcdHN0YXR1czogc3RyaW5nLFxuXHRcdHBhdGg6IHN0cmluZyxcblx0XHRmdWxscGF0aDogc3RyaW5nLFxuXHR9W10gPSBbXTtcblxuXHRpZiAoZnJvbSAhPSB0bylcblx0e1xuXHRcdGxldCBsb2cgPSBjcm9zc1NwYXduLnN5bmMoJ2dpdCcsIGZpbHRlckFyZ3YoW1xuXHRcdFx0Li4uJ2RpZmYtdHJlZSAtciAtLW5vLWNvbW1pdC1pZCAtLW5hbWUtc3RhdHVzJy5zcGxpdCgnICcpLFxuXHRcdFx0YC0tZW5jb2Rpbmc9JHtvcHRpb25zLmVuY29kaW5nfWAsXG5cdFx0XHRyZXZpc2lvblJhbmdlKGZyb20sIHRvLCBvcHRzMiksXG5cdFx0XSksIHtcblx0XHRcdC8vc3RkaW86ICdpbmhlcml0Jyxcblx0XHRcdGN3ZCxcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHR9KTtcblxuXHRcdGlmIChsb2cuZXJyb3IgfHwgbG9nLnN0ZGVyci5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGxvZy5zdGRlcnIudG9TdHJpbmcoKSlcblx0XHR9XG5cblx0XHRsaXN0ID0gY3JsZihsb2cuc3Rkb3V0LnRvU3RyaW5nKCkpXG5cdFx0XHQuc3BsaXQoTEYpXG5cdFx0XHQucmVkdWNlKGZ1bmN0aW9uIChhLCBsaW5lKVxuXHRcdFx0e1xuXHRcdFx0XHRsaW5lID0gbGluZS5yZXBsYWNlKC9eXFxzKy9nLCAnJyk7XG5cblx0XHRcdFx0aWYgKGxpbmUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgW3N0YXR1cywgZmlsZV0gPSBsaW5lLnNwbGl0KC9cXHQvKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIOaykuacieato+eiuuWbnuWCsyB1dGYtOCDogIzmmK/orormiJDnt6jnorzljJZcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRmaWxlID0gZGVjb2RlMihmaWxlKTtcblxuXHRcdFx0XHRcdGxldCBmdWxscGF0aCA9IHBhdGguam9pbihyb290LCBmaWxlKTtcblx0XHRcdFx0XHRmaWxlID0gcGF0aC5yZWxhdGl2ZShyb290LCBmdWxscGF0aCk7XG5cblx0XHRcdFx0XHRsZXQgcm93ID0ge1xuXHRcdFx0XHRcdFx0c3RhdHVzLFxuXHRcdFx0XHRcdFx0cGF0aDogZmlsZSxcblx0XHRcdFx0XHRcdGZ1bGxwYXRoLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRmaWxlcy5wdXNoKGZpbGUpO1xuXG5cdFx0XHRcdFx0YS5wdXNoKHJvdylcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSwgW10pXG5cdFx0O1xuXHR9XG5cblx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cdHJvb3QgPSBwYXRoLnJlc29sdmUocm9vdCk7XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obGlzdCwge1xuXHRcdGZyb20sXG5cdFx0dG8sXG5cdFx0Y3dkLFxuXHRcdHJvb3QsXG5cdFx0ZmlsZXMsXG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQXJndihhcmd2OiBzdHJpbmdbXSlcbntcblx0cmV0dXJuIGFyZ3YuZmlsdGVyKGZ1bmN0aW9uICh2KVxuXHR7XG5cdFx0cmV0dXJuIHYgIT09IG51bGwgJiYgdiAhPT0gJydcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdpdERpZmZGcm9tO1xuIl19