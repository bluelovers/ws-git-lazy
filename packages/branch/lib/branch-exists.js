"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchExists = void 0;
const tslib_1 = require("tslib");
const branch_list_1 = tslib_1.__importDefault(require("./branch-list"));
function localBranchExists(name, REPO_PATH) {
    return (0, branch_list_1.default)(REPO_PATH).includes(name);
}
exports.localBranchExists = localBranchExists;
exports.default = localBranchExists;
//# sourceMappingURL=branch-exists.js.map