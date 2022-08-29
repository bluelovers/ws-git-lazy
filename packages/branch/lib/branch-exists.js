"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchExists = exports._localBranchExists = exports._localBranchExistsCore = void 0;
const branch_list_1 = require("./branch-list");
function _localBranchExistsCore(name, list) {
    return list.find((current) => {
        return current === name || (current === `refs/heads/${name}` && !name.startsWith('refs/heads/'));
    });
}
exports._localBranchExistsCore = _localBranchExistsCore;
function _localBranchExists(name, REPO_PATH) {
    const list = (0, branch_list_1.localBranchList)(REPO_PATH);
    return _localBranchExistsCore(name, list);
}
exports._localBranchExists = _localBranchExists;
function localBranchExists(name, REPO_PATH) {
    var _a;
    return ((_a = _localBranchExists(name, REPO_PATH)) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.localBranchExists = localBranchExists;
exports.default = localBranchExists;
//# sourceMappingURL=branch-exists.js.map