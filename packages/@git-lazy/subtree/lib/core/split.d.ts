/// <reference types="node" />
import { IOptionsRuntime, IOptionsSplit, EnumSubtreeCmd } from '../types';
export declare function assertValueSplit<O extends IOptionsSplit = IOptionsSplit>(optionsRuntime: IOptionsRuntime<O> | any): asserts optionsRuntime is IOptionsRuntime<O>;
export declare function handleValueSplit<O extends IOptionsSplit = IOptionsSplit>(options: O | any): O;
export declare function handleOptionsSplit<O extends IOptionsSplit = IOptionsSplit>(options: O): IOptionsRuntime<O>;
export declare function unparseCmdSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, opts: IOptionsRuntime<O>): string[];
export declare function _cmdSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, opts: IOptionsRuntime<O>): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
export declare function _callSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, options: O): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
