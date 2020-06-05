/**
 * Created by user on 2020/6/5.
 */
/// <reference types="node" />
import { EnumSubtreeCmd, IOptions, IOptionsRuntime } from './types';
export declare function handleOptions(options: IOptions): IOptionsRuntime;
export declare function _cmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
export declare function _call(cmd: EnumSubtreeCmd, options: IOptions): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
