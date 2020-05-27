/**
 * Created by user on 2020/5/27.
 */
import { Console } from 'debug-color2';
import _debug from 'debug';
export declare function createConsole(...argv: any[]): Console;
export declare const console: Console;
export declare const debug: _debug.Debugger;
export declare const debugConsole: Console;
export declare function enableDebug(): void;
export declare function disableDebug(): void;
export default console;
