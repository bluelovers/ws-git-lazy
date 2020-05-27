"use strict";
/**
 * Created by user on 2019/6/13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchGlob = void 0;
const micromatch_1 = __importDefault(require("micromatch"));
function matchGlob(list, pattern) {
    return micromatch_1.default(list, pattern);
}
exports.matchGlob = matchGlob;
exports.default = matchGlob;
//# sourceMappingURL=match.js.map