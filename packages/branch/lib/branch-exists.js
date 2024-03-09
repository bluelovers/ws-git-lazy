"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._localBranchExistsCore = _localBranchExistsCore;
exports._localBranchExists = _localBranchExists;
exports.localBranchExists = localBranchExists;
const branch_list_1 = require("./branch-list");
function _localBranchExistsCore(name, list) {
    return list.find((current) => {
        return current === name || (current === `refs/heads/${name}` && !name.startsWith('refs/heads/'));
    });
}
function _localBranchExists(name, REPO_PATH) {
    const list = (0, branch_list_1.localBranchList)(REPO_PATH);
    return _localBranchExistsCore(name, list);
}
function localBranchExists(name, REPO_PATH) {
    var _a;
    return ((_a = _localBranchExists(name, REPO_PATH)) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.default = localBranchExists;
//# sourceMappingURL=branch-exists.js.map