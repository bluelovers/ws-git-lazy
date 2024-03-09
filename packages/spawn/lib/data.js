"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTree = void 0;
exports.handleSpawnOutputArray = handleSpawnOutputArray;
exports._filterEmpty = _filterEmpty;
const sort_tree_1 = require("@lazy-glob/sort-tree");
Object.defineProperty(exports, "sortTree", { enumerable: true, get: function () { return sort_tree_1.sortTree; } });
const array_hyper_unique_1 = require("array-hyper-unique");
function handleSpawnOutputArray(output, trimFn) {
    trimFn = trimFn || (s => s);
    return (0, sort_tree_1.sortTree)((0, array_hyper_unique_1.array_unique)(output
        .split(/[\n\r]+/)
        .map(s => trimFn(s).trim())
        .filter(_filterEmpty)));
}
function _filterEmpty(v) {
    return v !== void 0 && v !== null && v !== '';
}
exports.default = handleSpawnOutputArray;
//# sourceMappingURL=data.js.map