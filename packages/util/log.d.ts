/**
 * Created by user on 2019/3/10.
 */
import { Console } from 'debug-color2';
import _debug = require('debug');
export declare function createConsole(...argv: any[]): Console;
export declare const console: Console;
export declare const debug: _debug.Debugger;
export declare const debugConsole: Console;
export declare function enableDebug(): void;
export declare function disableDebug(): void;
export default console;
