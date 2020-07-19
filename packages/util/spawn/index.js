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
exports.async = exports.sync = exports.crossSpawnAsync = exports.crossSpawnSync = void 0;
const cross_spawn_extra_1 = require("cross-spawn-extra");
Object.defineProperty(exports, "crossSpawnSync", { enumerable: true, get: function () { return cross_spawn_extra_1.sync; } });
Object.defineProperty(exports, "sync", { enumerable: true, get: function () { return cross_spawn_extra_1.sync; } });
Object.defineProperty(exports, "crossSpawnAsync", { enumerable: true, get: function () { return cross_spawn_extra_1.async; } });
Object.defineProperty(exports, "async", { enumerable: true, get: function () { return cross_spawn_extra_1.async; } });
__exportStar(require("./types"), exports);
exports.default = exports;
//# sourceMappingURL=index.js.map