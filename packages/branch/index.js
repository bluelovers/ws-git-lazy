"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchList = exports.localBranchExists = exports.currentBranchName = exports.createEmptyBranch = void 0;
/**
 * Created by user on 2019/3/10.
 */
const create_empty_1 = require("./lib/create-empty");
Object.defineProperty(exports, "createEmptyBranch", { enumerable: true, get: function () { return create_empty_1.createEmptyBranch; } });
const current_name_1 = require("./lib/current-name");
Object.defineProperty(exports, "currentBranchName", { enumerable: true, get: function () { return current_name_1.currentBranchName; } });
const branch_exists_1 = require("./lib/branch-exists");
Object.defineProperty(exports, "localBranchExists", { enumerable: true, get: function () { return branch_exists_1.localBranchExists; } });
const branch_list_1 = require("./lib/branch-list");
Object.defineProperty(exports, "localBranchList", { enumerable: true, get: function () { return branch_list_1.localBranchList; } });
exports.default = exports;
//# sourceMappingURL=index.js.map