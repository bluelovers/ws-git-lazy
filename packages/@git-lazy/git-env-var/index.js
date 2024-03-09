"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitEnv = getGitEnv;
function getGitEnv(key, env) {
    return (env !== null && env !== void 0 ? env : process.env)[key];
}
exports.default = getGitEnv;
//# sourceMappingURL=index.js.map