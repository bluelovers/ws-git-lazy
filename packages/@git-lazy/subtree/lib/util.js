"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertString = exports.handlePrefixPath = exports.inSubPath = exports.handlePrefix = void 0;
const upath2_1 = require("upath2");
const path_1 = require("path");
const types_1 = require("./types");
function handlePrefix(prefix) {
    const bool = /^\.[\/\\]/.test(prefix);
    prefix = (0, upath2_1.normalize)(prefix);
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
    else if ((0, path_1.isAbsolute)(prefix)) {
        prefixType = types_1.EnumPrefixType.ABSOLUTE;
    }
    return {
        prefixType,
        prefix,
    };
}
exports.handlePrefix = handlePrefix;
function inSubPath(sub, root) {
    let r = (0, upath2_1.normalize)(root);
    let s = (0, upath2_1.normalize)(sub);
    return s.indexOf(r) === 0 && s.length > r.length;
}
exports.inSubPath = inSubPath;
function handlePrefixPath(options) {
    let { prefix, prefixType, root, cwd, } = options;
    let prefixPath = prefix;
    if (prefixType !== types_1.EnumPrefixType.ROOT) {
        prefixPath = (0, upath2_1.resolve)(cwd, prefix);
        if (inSubPath(prefixPath, root)) {
            prefixPath = (0, upath2_1.relative)(root, prefixPath);
        }
        else {
            throw new Error(`prefix path is not allow: ${prefixPath}`);
        }
    }
    return {
        prefixPath,
        prefix,
        prefixType,
        root,
        cwd,
    };
}
exports.handlePrefixPath = handlePrefixPath;
function assertString(value, name) {
    if (typeof value !== 'string' || !value.length) {
        throw new TypeError(`${name !== null && name !== void 0 ? name : 'value'} is not valid: ${value}`);
    }
}
exports.assertString = assertString;
//# sourceMappingURL=util.js.map