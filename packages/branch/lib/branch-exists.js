"use strict";
/**
 * Created by user on 2019/3/10.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchExists = void 0;
const branch_list_1 = __importDefault(require("./branch-list"));
function localBranchExists(name, REPO_PATH) {
    return branch_list_1.default(REPO_PATH).includes(name);
}
exports.localBranchExists = localBranchExists;
exports.default = localBranchExists;
//# sourceMappingURL=branch-exists.js.map