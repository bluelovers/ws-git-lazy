"use strict";
/**
 * Created by user on 2019/3/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugConsole = exports.debug = exports.disableDebug = exports.enableDebug = exports.console = void 0;
const log_1 = require("./log");
Object.defineProperty(exports, "console", { enumerable: true, get: function () { return log_1.console; } });
Object.defineProperty(exports, "debug", { enumerable: true, get: function () { return log_1.debug; } });
Object.defineProperty(exports, "debugConsole", { enumerable: true, get: function () { return log_1.debugConsole; } });
Object.defineProperty(exports, "disableDebug", { enumerable: true, get: function () { return log_1.disableDebug; } });
Object.defineProperty(exports, "enableDebug", { enumerable: true, get: function () { return log_1.enableDebug; } });
var util_1 = require("./util");
Object.defineProperty(exports, "notEmptyString", { enumerable: true, get: function () { return util_1.notEmptyString; } });
Object.defineProperty(exports, "getCWD", { enumerable: true, get: function () { return util_1.getCWD; } });
exports.default = exports;
//# sourceMappingURL=index.js.map