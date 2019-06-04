"use strict";
/**
 * Created by user on 2019/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const parse_git_config_1 = require("parse-git-config");
const gitRoot = require("git-root2");
const glob_search_1 = require("glob-search");
function findConfigPathLocal(cwd) {
    let root = gitRoot(cwd || process.cwd());
    return glob_search_1.globSearchSync([
        ".git/config",
    ], {
        cwd: root,
        absolute: true,
        onlyFiles: true,
        stopPath: root,
    }).value[0];
}
exports.findConfigPathLocal = findConfigPathLocal;
function parseConfig(file) {
    let o = parse_git_config_1.sync({
        path: file,
    });
    return parse_git_config_1.expandKeys(o);
}
exports.parseConfig = parseConfig;
function filterRemoteUrl(o) {
    let ret;
    if (o.branch && o.branch.master && o.branch.master.remote) {
        ret = _(o.branch.master.remote);
    }
    if (!ret) {
        ret = _('origin');
    }
    if (!ret) {
        let ls = Object.keys(o.remote);
        for (let row of ls) {
            ret = _(row);
            if (ret) {
                break;
            }
        }
    }
    return ret;
    function _(name) {
        if (o.remote && o.remote[name] && o.remote[name].url) {
            return o.remote[name].url;
        }
    }
}
exports.filterRemoteUrl = filterRemoteUrl;
exports.default = findConfigPathLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdURBQXlGO0FBQ3pGLHFDQUFzQztBQUN0Qyw2Q0FBc0U7QUFFdEUsU0FBZ0IsbUJBQW1CLENBQUMsR0FBWTtJQUUvQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRXpDLE9BQU8sNEJBQWMsQ0FBQztRQUNyQixhQUFhO0tBQ2IsRUFBRTtRQUNGLEdBQUcsRUFBRSxJQUFJO1FBQ1QsUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTLEVBQUUsSUFBSTtRQUNmLFFBQVEsRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNaLENBQUM7QUFaRCxrREFZQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxJQUFZO0lBd0J2QyxJQUFJLENBQUMsR0FBRyx1QkFBYyxDQUFDO1FBQ3RCLElBQUksRUFBRSxJQUFJO0tBQ1YsQ0FBQyxDQUFDO0lBRUgsT0FBTyw2QkFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JCLENBQUM7QUE3QkQsa0NBNkJDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLENBQWlDO0lBRWhFLElBQUksR0FBVyxDQUFDO0lBRWhCLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ3pEO1FBQ0MsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUMvQjtJQUVELElBQUksQ0FBQyxHQUFHLEVBQ1I7UUFDQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ2pCO0lBRUQsSUFBSSxDQUFDLEdBQUcsRUFDUjtRQUNDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9CLEtBQUssSUFBSSxHQUFHLElBQUksRUFBRSxFQUNsQjtZQUNDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFWixJQUFJLEdBQUcsRUFDUDtnQkFDQyxNQUFNO2FBQ047U0FDRDtLQUNEO0lBRUQsT0FBTyxHQUFHLENBQUE7SUFFVixTQUFTLENBQUMsQ0FBQyxJQUFZO1FBRXRCLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUNwRDtZQUNDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUE7U0FDekI7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQXRDRCwwQ0FzQ0M7QUFFRCxrQkFBZSxtQkFBbUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNi80LlxuICovXG5cbmltcG9ydCB7IHJlc29sdmVDb25maWdQYXRoLCBzeW5jIGFzIHBhcnNlR2l0Q29uZmlnLCBleHBhbmRLZXlzIH0gZnJvbSAncGFyc2UtZ2l0LWNvbmZpZyc7XG5pbXBvcnQgZ2l0Um9vdCA9IHJlcXVpcmUoJ2dpdC1yb290MicpO1xuaW1wb3J0IHsgZ2xvYlNlYXJjaCwgZ2xvYlNlYXJjaFN5bmMsIGFzeW5jLCBzeW5jIH0gZnJvbSAnZ2xvYi1zZWFyY2gnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbmZpZ1BhdGhMb2NhbChjd2Q/OiBzdHJpbmcpXG57XG5cdGxldCByb290ID0gZ2l0Um9vdChjd2QgfHwgcHJvY2Vzcy5jd2QoKSk7XG5cblx0cmV0dXJuIGdsb2JTZWFyY2hTeW5jKFtcblx0XHRcIi5naXQvY29uZmlnXCIsXG5cdF0sIHtcblx0XHRjd2Q6IHJvb3QsXG5cdFx0YWJzb2x1dGU6IHRydWUsXG5cdFx0b25seUZpbGVzOiB0cnVlLFxuXHRcdHN0b3BQYXRoOiByb290LFxuXHR9KS52YWx1ZVswXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb25maWcoZmlsZTogc3RyaW5nKToge1xuXHRjb3JlPzoge1xuXHRcdHJlcG9zaXRvcnlmb3JtYXR2ZXJzaW9uPzogbnVtYmVyLFxuXG5cdFx0ZmlsZW1vZGU/OiBib29sZWFuLFxuXHRcdGJhcmU/OiBib29sZWFuLFxuXHRcdGxvZ2FsbHJlZnVwZGF0ZXM/OiBib29sZWFuLFxuXHRcdHN5bWxpbmtzPzogYm9vbGVhbixcblx0XHRpZ25vcmVjYXNlPzogYm9vbGVhbixcblxuXHRcdFtrOiBzdHJpbmddOiB1bmtub3duXG5cdH0sXG5cdHJlbW90ZT86IFJlY29yZDxzdHJpbmcgfCAnb3JpZ2luJywge1xuXHRcdHVybD86IHN0cmluZyxcblx0XHRmZXRjaD86IHN0cmluZ1xuXHRcdFtrOiBzdHJpbmddOiB1bmtub3duXG5cdH0+XG5cdGJyYW5jaD86IFJlY29yZDxzdHJpbmcgfCAnbWFzdGVyJywge1xuXHRcdHJlbW90ZT86ICdvcmlnaW4nIHwgc3RyaW5nLFxuXHRcdG1lcmdlPzogc3RyaW5nLFxuXHRcdFtrOiBzdHJpbmddOiB1bmtub3duXG5cdH0+XG59XG57XG5cdGxldCBvID0gcGFyc2VHaXRDb25maWcoe1xuXHRcdHBhdGg6IGZpbGUsXG5cdH0pO1xuXG5cdHJldHVybiBleHBhbmRLZXlzKG8pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJSZW1vdGVVcmwobzogUmV0dXJuVHlwZTx0eXBlb2YgcGFyc2VDb25maWc+KTogc3RyaW5nXG57XG5cdGxldCByZXQ6IHN0cmluZztcblxuXHRpZiAoby5icmFuY2ggJiYgby5icmFuY2gubWFzdGVyICYmIG8uYnJhbmNoLm1hc3Rlci5yZW1vdGUpXG5cdHtcblx0XHRyZXQgPSBfKG8uYnJhbmNoLm1hc3Rlci5yZW1vdGUpXG5cdH1cblxuXHRpZiAoIXJldClcblx0e1xuXHRcdHJldCA9IF8oJ29yaWdpbicpXG5cdH1cblxuXHRpZiAoIXJldClcblx0e1xuXHRcdGxldCBscyA9IE9iamVjdC5rZXlzKG8ucmVtb3RlKTtcblxuXHRcdGZvciAobGV0IHJvdyBvZiBscylcblx0XHR7XG5cdFx0XHRyZXQgPSBfKHJvdylcblxuXHRcdFx0aWYgKHJldClcblx0XHRcdHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJldFxuXG5cdGZ1bmN0aW9uIF8obmFtZTogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRpZiAoby5yZW1vdGUgJiYgby5yZW1vdGVbbmFtZV0gJiYgby5yZW1vdGVbbmFtZV0udXJsKVxuXHRcdHtcblx0XHRcdHJldHVybiBvLnJlbW90ZVtuYW1lXS51cmxcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluZENvbmZpZ1BhdGhMb2NhbFxuIl19