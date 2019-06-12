"use strict";
/**
 * Created by user on 2019/6/13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_root2_1 = __importDefault(require("git-root2"));
exports.gitRoot = git_root2_1.default;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function hasGit(cwd) {
    if (!cwd || typeof cwd !== 'string' || !git_root2_1.default(cwd)) {
        throw new TypeError(`'${cwd}' is not exists in git`);
    }
    return cwd;
}
exports.hasGit = hasGit;
function isGitRoot(cwd, realpath) {
    let p1 = path_1.default.normalize(cwd);
    let p2 = path_1.default.normalize(git_root2_1.default(cwd));
    if (realpath) {
        return (fs_1.default.realpathSync(p1) === fs_1.default.realpathSync(p2));
    }
    return (p1 === p2);
}
exports.isGitRoot = isGitRoot;
exports.default = git_root2_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsMERBQStCO0FBSXRCLGtCQUpGLG1CQUFPLENBSUU7QUFIaEIsZ0RBQXVCO0FBQ3ZCLDRDQUFtQjtBQUluQixTQUFnQixNQUFNLENBQUMsR0FBVztJQUVqQyxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxDQUFDLG1CQUFPLENBQUMsR0FBRyxDQUFDLEVBQ3BEO1FBQ0MsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztLQUNyRDtJQUVELE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQVJELHdCQVFDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLEdBQVcsRUFBRSxRQUFrQjtJQUV4RCxJQUFJLEVBQUUsR0FBRyxjQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLElBQUksRUFBRSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXRDLElBQUksUUFBUSxFQUNaO1FBQ0MsT0FBTyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssWUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ3BEO0lBRUQsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUNuQixDQUFDO0FBWEQsOEJBV0M7QUFFRCxrQkFBZSxtQkFBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS82LzEzLlxuICovXG5cbmltcG9ydCBnaXRSb290IGZyb20gJ2dpdC1yb290MidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmV4cG9ydCB7IGdpdFJvb3QgfVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzR2l0KGN3ZDogc3RyaW5nKTogc3RyaW5nXG57XG5cdGlmICghY3dkIHx8IHR5cGVvZiBjd2QgIT09ICdzdHJpbmcnIHx8ICFnaXRSb290KGN3ZCkpXG5cdHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAnJHtjd2R9JyBpcyBub3QgZXhpc3RzIGluIGdpdGApO1xuXHR9XG5cblx0cmV0dXJuIGN3ZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHaXRSb290KGN3ZDogc3RyaW5nLCByZWFscGF0aD86IGJvb2xlYW4pXG57XG5cdGxldCBwMSA9IHBhdGgubm9ybWFsaXplKGN3ZCk7XG5cdGxldCBwMiA9IHBhdGgubm9ybWFsaXplKGdpdFJvb3QoY3dkKSk7XG5cblx0aWYgKHJlYWxwYXRoKVxuXHR7XG5cdFx0cmV0dXJuIChmcy5yZWFscGF0aFN5bmMocDEpID09PSBmcy5yZWFscGF0aFN5bmMocDIpKVxuXHR9XG5cblx0cmV0dXJuIChwMSA9PT0gcDIpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdpdFJvb3RcbiJdfQ==