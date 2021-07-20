"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtreeSplit = exports.subtreePull = exports.subtreePush = exports.subtreeAdd = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./lib/types");
const core_1 = require("./lib/core");
const split_1 = require("./lib/core/split");
(0, tslib_1.__exportStar)(require("./lib/types"), exports);
async function subtreeAdd(options) {
    return (0, core_1._call)(types_1.EnumSubtreeCmd.add, options);
}
exports.subtreeAdd = subtreeAdd;
async function subtreePush(options) {
    return (0, core_1._call)(types_1.EnumSubtreeCmd.push, options);
}
exports.subtreePush = subtreePush;
async function subtreePull(options) {
    return (0, core_1._call)(types_1.EnumSubtreeCmd.pull, options);
}
exports.subtreePull = subtreePull;
async function subtreeSplit(options) {
    return (0, split_1._callSplit)(types_1.EnumSubtreeCmd.split, options);
}
exports.subtreeSplit = subtreeSplit;
exports.default = exports;
//# sourceMappingURL=index.js.map