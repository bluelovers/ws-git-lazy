"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossSpawnAsync = exports.crossSpawnSync = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("@git-lazy/spawn/lib/types"), exports);
tslib_1.__exportStar(require("@git-lazy/spawn"), exports);
const spawn_1 = require("@git-lazy/spawn");
Object.defineProperty(exports, "crossSpawnSync", { enumerable: true, get: function () { return spawn_1.crossSpawnGitSync; } });
Object.defineProperty(exports, "crossSpawnAsync", { enumerable: true, get: function () { return spawn_1.crossSpawnGitAsync; } });
exports.default = exports;
//# sourceMappingURL=git.js.map