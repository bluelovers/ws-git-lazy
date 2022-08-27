"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchExists = void 0;
const branch_list_1 = require("./branch-list");
function localBranchExists(name, REPO_PATH) {
    return (0, branch_list_1.localBranchList)(REPO_PATH).includes(name);
}
exports.localBranchExists = localBranchExists;
exports.default = localBranchExists;
//# sourceMappingURL=branch-exists.js.map