"use strict";
/**
 * Created by user on 2020/5/27.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableDebug = exports.enableDebug = exports.debugConsole = exports.debug = exports.console = exports.createConsole = void 0;
const debug_color2_1 = require("debug-color2");
const debug_1 = __importDefault(require("debug"));
function createConsole(...argv) {
    const console = new debug_color2_1.Console(...argv);
    console.enabledColor = true;
    console.inspectOptions = console.inspectOptions || {};
    console.inspectOptions.colors = true;
    return console;
}
exports.createConsole = createConsole;
exports.console = createConsole();
exports.debug = debug_1.default('@git-lazy');
exports.debugConsole = createConsole();
exports.debug.log = exports.debugConsole.grey;
exports.debugConsole.enabled = exports.debug.enabled;
function enableDebug() {
    exports.debug.enabled = true;
    exports.debugConsole.enabled = true;
}
exports.enableDebug = enableDebug;
function disableDebug() {
    exports.debug.enabled = false;
    exports.debugConsole.enabled = false;
}
exports.disableDebug = disableDebug;
exports.default = exports.console;
//# sourceMappingURL=index.js.map