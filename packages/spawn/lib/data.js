"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._filterEmpty = exports.handleSpawnOutputArray = exports.sortTree = void 0;
const glob_sort_1 = require("node-novel-globby/lib/glob-sort");
Object.defineProperty(exports, "sortTree", { enumerable: true, get: function () { return glob_sort_1.sortTree; } });
const array_hyper_unique_1 = require("array-hyper-unique");
function handleSpawnOutputArray(output, trimFn) {
    trimFn = trimFn || (s => s);
    return glob_sort_1.sortTree(array_hyper_unique_1.array_unique(output
        .split(/[\n\r]+/)
        .map(s => trimFn(s).trim())
        .filter(_filterEmpty)));
}
exports.handleSpawnOutputArray = handleSpawnOutputArray;
function _filterEmpty(v) {
    return v !== void 0 && v !== null && v !== '';
}
exports._filterEmpty = _filterEmpty;
exports.default = handleSpawnOutputArray;
//# sourceMappingURL=data.js.map