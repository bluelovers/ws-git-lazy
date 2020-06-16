"use strict";
/**
 * Created by user on 2019/6/4.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRemoteUrl = exports.parseConfig = exports.findConfigPathLocal = void 0;
const parse_git_config_1 = require("parse-git-config");
const core_1 = __importDefault(require("git-root2/core"));
const glob_search_1 = require("glob-search");
function findConfigPathLocal(cwd) {
    let root = core_1.default(cwd || process.cwd());
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
//# sourceMappingURL=index.js.map