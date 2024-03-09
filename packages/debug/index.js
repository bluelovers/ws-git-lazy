"use strict";
/**
 * Created by user on 2020/5/27.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugConsole = exports.debug = exports.console = void 0;
exports.createConsole = createConsole;
exports.enableDebug = enableDebug;
exports.disableDebug = disableDebug;
const tslib_1 = require("tslib");
const debug_color2_1 = require("debug-color2");
const debug_1 = tslib_1.__importDefault(require("debug"));
function createConsole(...argv) {
    const console = new debug_color2_1.Console(...argv);
    console.enabledColor = true;
    console.inspectOptions = console.inspectOptions || {};
    console.inspectOptions.colors = true;
    return console;
}
exports.console = createConsole();
exports.debug = (0, debug_1.default)('@git-lazy');
exports.debugConsole = createConsole(null, {
    label: true,
    time: true,
});
let _log = exports.debugConsole.grey;
exports.debug.log = _log.bind(_log);
exports.debugConsole.enabled = exports.debug.enabled;
function enableDebug() {
    exports.debug.enabled = true;
    exports.debugConsole.enabled = true;
}
function disableDebug() {
    exports.debug.enabled = false;
    exports.debugConsole.enabled = false;
}
exports.default = exports.console;
//# sourceMappingURL=index.js.map