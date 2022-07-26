"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitEnv = void 0;
function getGitEnv(key, env) {
    return (env !== null && env !== void 0 ? env : process.env)[key];
}
exports.getGitEnv = getGitEnv;
exports.default = getGitEnv;
//# sourceMappingURL=index.js.map