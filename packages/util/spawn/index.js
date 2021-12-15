"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = exports.sync = exports.crossSpawnAsync = exports.crossSpawnSync = void 0;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
Object.defineProperty(exports, "crossSpawnSync", { enumerable: true, get: function () { return cross_spawn_extra_1.sync; } });
Object.defineProperty(exports, "sync", { enumerable: true, get: function () { return cross_spawn_extra_1.sync; } });
Object.defineProperty(exports, "crossSpawnAsync", { enumerable: true, get: function () { return cross_spawn_extra_1.async; } });
Object.defineProperty(exports, "async", { enumerable: true, get: function () { return cross_spawn_extra_1.async; } });
tslib_1.__exportStar(require("./types"), exports);
exports.default = exports;
//# sourceMappingURL=index.js.map