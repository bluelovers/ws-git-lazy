"use strict";
/**
 * Created by user on 2019/3/10.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossSpawnAsync = exports.crossSpawnSync = void 0;
__exportStar(require("@git-lazy/spawn/lib/types"), exports);
__exportStar(require("@git-lazy/spawn"), exports);
const spawn_1 = require("@git-lazy/spawn");
Object.defineProperty(exports, "crossSpawnSync", { enumerable: true, get: function () { return spawn_1.crossSpawnGitSync; } });
Object.defineProperty(exports, "crossSpawnAsync", { enumerable: true, get: function () { return spawn_1.crossSpawnGitAsync; } });
exports.default = exports;
//# sourceMappingURL=git.js.map