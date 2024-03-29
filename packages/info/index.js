"use strict";
/**
 * Created by user on 2019/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfigPathLocal = findConfigPathLocal;
exports.parseConfig = parseConfig;
exports.filterRemoteUrl = filterRemoteUrl;
const parse_git_config_1 = require("parse-git-config");
const core_1 = require("git-root2/core");
const glob_search_1 = require("glob-search");
function findConfigPathLocal(cwd) {
    let root = (0, core_1.gitRoot)(cwd || process.cwd());
    return (0, glob_search_1.globSearchSync)([
        ".git/config",
    ], {
        cwd: root,
        absolute: true,
        onlyFiles: true,
        stopPath: root,
    }).value[0];
}
function parseConfig(file) {
    let o = (0, parse_git_config_1.sync)({
        path: file,
    });
    return (0, parse_git_config_1.expandKeys)(o);
}
function filterRemoteUrl(o) {
    let ret;
    if (o.branch && o.branch['master'] && o.branch['master'].remote) {
        ret = _(o.branch['master'].remote);
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
exports.default = findConfigPathLocal;
//# sourceMappingURL=index.js.map