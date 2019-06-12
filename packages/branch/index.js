"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztHQUVHO0FBQ0gsc0VBQW1EO0FBTWxELDRCQU5NLHNCQUFpQixDQU1OO0FBTGxCLHNFQUFtRDtBQU1sRCw0QkFOTSxzQkFBaUIsQ0FNTjtBQUxsQix3RUFBb0Q7QUFNbkQsNEJBTk0sdUJBQWlCLENBTU47QUFMbEIsb0VBQWdEO0FBTS9DLDBCQU5NLHFCQUFlLENBTU47QUFHaEIsa0JBQWUsT0FBbUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvMy8xMC5cbiAqL1xuaW1wb3J0IGNyZWF0ZUVtcHR5QnJhbmNoIGZyb20gJy4vbGliL2NyZWF0ZS1lbXB0eSc7XG5pbXBvcnQgY3VycmVudEJyYW5jaE5hbWUgZnJvbSAnLi9saWIvY3VycmVudC1uYW1lJztcbmltcG9ydCBsb2NhbEJyYW5jaEV4aXN0cyBmcm9tICcuL2xpYi9icmFuY2gtZXhpc3RzJztcbmltcG9ydCBsb2NhbEJyYW5jaExpc3QgZnJvbSAnLi9saWIvYnJhbmNoLWxpc3QnO1xuXG5leHBvcnQge1xuXHRjcmVhdGVFbXB0eUJyYW5jaCxcblx0Y3VycmVudEJyYW5jaE5hbWUsXG5cdGxvY2FsQnJhbmNoRXhpc3RzLFxuXHRsb2NhbEJyYW5jaExpc3QsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHMgYXMgdHlwZW9mIGltcG9ydCgnLi9pbmRleCcpO1xuIl19