"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inSubPath = exports.handlePrefix = void 0;
const upath2_1 = require("upath2");
const path_1 = require("path");
const types_1 = require("./types");
function handlePrefix(prefix) {
    const bool = /^\.[\/\\]/.test(prefix);
    prefix = upath2_1.normalize(prefix);
    if (bool && !prefix.startsWith('../')) {
        prefix = './' + prefix;
    }
    let prefixType = types_1.EnumPrefixType.ROOT;
    if (/^\/[^\/]/.test(prefix)) {
        prefix = prefix.slice(1);
    }
    else if (prefix.startsWith('../') || prefix.startsWith('./')) {
        prefixType = types_1.EnumPrefixType.RELATIVE;
    }
    else if (path_1.isAbsolute(prefix)) {
        prefixType = types_1.EnumPrefixType.ABSOLUTE;
    }
    return {
        prefixType,
        prefix,
    };
}
exports.handlePrefix = handlePrefix;
function inSubPath(sub, root) {
    let r = upath2_1.normalize(root);
    let s = upath2_1.normalize(sub);
    return s.indexOf(r) === 0 && s.length > r.length;
}
exports.inSubPath = inSubPath;
//# sourceMappingURL=util.js.map