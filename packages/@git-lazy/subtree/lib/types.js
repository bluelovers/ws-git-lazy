"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumSubtreeCmd = exports.EnumPrefixType = void 0;
var EnumPrefixType;
(function (EnumPrefixType) {
    EnumPrefixType[EnumPrefixType["ROOT"] = 0] = "ROOT";
    EnumPrefixType[EnumPrefixType["RELATIVE"] = 1] = "RELATIVE";
    EnumPrefixType[EnumPrefixType["ABSOLUTE"] = 2] = "ABSOLUTE";
})(EnumPrefixType = exports.EnumPrefixType || (exports.EnumPrefixType = {}));
var EnumSubtreeCmd;
(function (EnumSubtreeCmd) {
    EnumSubtreeCmd["add"] = "add";
    EnumSubtreeCmd["push"] = "push";
    EnumSubtreeCmd["pull"] = "pull";
    EnumSubtreeCmd["split"] = "split";
})(EnumSubtreeCmd = exports.EnumSubtreeCmd || (exports.EnumSubtreeCmd = {}));
//# sourceMappingURL=types.js.map