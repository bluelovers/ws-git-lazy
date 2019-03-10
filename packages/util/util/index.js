"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getCWD(cwd, realpath, failback) {
    if (notEmptyString(cwd)) {
        //cwd = cwd.trim();
    }
    else if (cwd == null) {
        if (typeof failback === 'function') {
            cwd = failback();
        }
        else if (notEmptyString(failback)) {
            cwd = failback;
        }
        else {
            return process.cwd();
        }
        if (!notEmptyString(cwd)) {
            throw new Error(`cwd is ${cwd} by ${failback}`);
        }
    }
    else {
        cwd = undefined;
    }
    if (realpath && cwd != null) {
        if (realpath === 1 /* FS */) {
            return fs.realpathSync(cwd);
        }
        return path.resolve(cwd);
    }
    return cwd;
}
exports.getCWD = getCWD;
function notEmptyString(s) {
    return typeof s === 'string' && s.trim() !== '';
}
exports.notEmptyString = notEmptyString;
exports.default = exports;
//console.log(getCWD(null, true, 'll'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUEwQjtBQUMxQiw2QkFBOEI7QUFFOUIsU0FBZ0IsTUFBTSxDQUFDLEdBQVksRUFBRSxRQUF3QyxFQUFFLFFBQWtDO0lBRWhILElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUN2QjtRQUNDLG1CQUFtQjtLQUNuQjtTQUNJLElBQUksR0FBRyxJQUFJLElBQUksRUFDcEI7UUFDQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFDbEM7WUFDQyxHQUFHLEdBQUcsUUFBUSxFQUFFLENBQUM7U0FDakI7YUFDSSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFDakM7WUFDQyxHQUFHLEdBQUcsUUFBUSxDQUFDO1NBQ2Y7YUFFRDtZQUNDLE9BQU8sT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO1NBQ3BCO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFDeEI7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDL0M7S0FDRDtTQUVEO1FBQ0MsR0FBRyxHQUFHLFNBQVMsQ0FBQztLQUNoQjtJQUVELElBQUksUUFBUSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQzNCO1FBQ0MsSUFBSSxRQUFRLGVBQTJCLEVBQ3ZDO1lBQ0MsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBMUNELHdCQTBDQztBQVlELFNBQWdCLGNBQWMsQ0FBQyxDQUFTO0lBRXZDLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDaEQsQ0FBQztBQUhELHdDQUdDO0FBRUQsa0JBQWUsT0FBbUMsQ0FBQztBQUVuRCx3Q0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDV0QoY3dkPzogc3RyaW5nLCByZWFscGF0aD86IGJvb2xlYW4gfCBnZXRDV0QuRW51bVJlYWxQYXRoLCBmYWlsYmFjaz86IHN0cmluZyB8ICgoKSA9PiBzdHJpbmcpKTogc3RyaW5nXG57XG5cdGlmIChub3RFbXB0eVN0cmluZyhjd2QpKVxuXHR7XG5cdFx0Ly9jd2QgPSBjd2QudHJpbSgpO1xuXHR9XG5cdGVsc2UgaWYgKGN3ZCA9PSBudWxsKVxuXHR7XG5cdFx0aWYgKHR5cGVvZiBmYWlsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHRjd2QgPSBmYWlsYmFjaygpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChub3RFbXB0eVN0cmluZyhmYWlsYmFjaykpXG5cdFx0e1xuXHRcdFx0Y3dkID0gZmFpbGJhY2s7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRyZXR1cm4gcHJvY2Vzcy5jd2QoKVxuXHRcdH1cblxuXHRcdGlmICghbm90RW1wdHlTdHJpbmcoY3dkKSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGN3ZCBpcyAke2N3ZH0gYnkgJHtmYWlsYmFja31gKVxuXHRcdH1cblx0fVxuXHRlbHNlXG5cdHtcblx0XHRjd2QgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAocmVhbHBhdGggJiYgY3dkICE9IG51bGwpXG5cdHtcblx0XHRpZiAocmVhbHBhdGggPT09IGdldENXRC5FbnVtUmVhbFBhdGguRlMpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGZzLnJlYWxwYXRoU3luYyhjd2QpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXRoLnJlc29sdmUoY3dkKTtcblx0fVxuXG5cdHJldHVybiBjd2Rcbn1cblxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIGdldENXRFxue1xuXHRleHBvcnQgY29uc3QgZW51bSBFbnVtUmVhbFBhdGhcblx0e1xuXHRcdE5PTkUgPSAwLFxuXHRcdEZTID0gMSxcblx0XHRQQVRIID0gMlxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RFbXB0eVN0cmluZyhzOiBzdHJpbmcpXG57XG5cdHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgJiYgcy50cmltKCkgIT09ICcnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHMgYXMgdHlwZW9mIGltcG9ydCgnLi9pbmRleCcpO1xuXG4vL2NvbnNvbGUubG9nKGdldENXRChudWxsLCB0cnVlLCAnbGwnKSk7XG4iXX0=