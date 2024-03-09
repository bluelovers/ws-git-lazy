"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchGlob = matchGlob;
const tslib_1 = require("tslib");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
function matchGlob(list, pattern) {
    return (0, micromatch_1.default)(list, pattern);
}
exports.default = matchGlob;
//# sourceMappingURL=match.js.map