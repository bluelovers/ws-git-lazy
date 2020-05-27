"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localBranchList = exports.localBranchExists = exports.currentBranchName = exports.createEmptyBranch = void 0;
/**
 * Created by user on 2019/3/10.
 */
const create_empty_1 = __importDefault(require("./lib/create-empty"));
exports.createEmptyBranch = create_empty_1.default;
const current_name_1 = __importDefault(require("./lib/current-name"));
exports.currentBranchName = current_name_1.default;
const branch_exists_1 = __importDefault(require("./lib/branch-exists"));
exports.localBranchExists = branch_exists_1.default;
const branch_list_1 = __importDefault(require("./lib/branch-list"));
exports.localBranchList = branch_list_1.default;
exports.default = exports;
//# sourceMappingURL=index.js.map