/**
 * Created by user on 2020/6/5.
 */
/// <reference types="node" />
import { EnumSubtreeCmd, IOptionsCommon, IOptionsRuntime, IOptions } from './types';
export declare function handleOptions<O extends IOptions = IOptionsCommon>(options: O): IOptionsRuntime<O>;
export declare function unparseCmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime): string[];
export declare function _cmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
export declare function _call(cmd: EnumSubtreeCmd, options: IOptionsCommon): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
