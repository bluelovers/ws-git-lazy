"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtreeSplit = exports.subtreePull = exports.subtreePush = exports.subtreeAdd = void 0;
const types_1 = require("./lib/types");
const core_1 = require("./lib/core");
const split_1 = require("./lib/core/split");
__exportStar(require("./lib/types"), exports);
async function subtreeAdd(options) {
    return core_1._call(types_1.EnumSubtreeCmd.add, options);
}
exports.subtreeAdd = subtreeAdd;
async function subtreePush(options) {
    return core_1._call(types_1.EnumSubtreeCmd.push, options);
}
exports.subtreePush = subtreePush;
async function subtreePull(options) {
    return core_1._call(types_1.EnumSubtreeCmd.pull, options);
}
exports.subtreePull = subtreePull;
async function subtreeSplit(options) {
    return split_1._callSplit(types_1.EnumSubtreeCmd.split, options);
}
exports.subtreeSplit = subtreeSplit;
exports.default = exports;
//# sourceMappingURL=index.js.map