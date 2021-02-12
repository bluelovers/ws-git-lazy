/// <reference types="node" />
import { IOptionsCommon, IOptionsSplit } from './lib/types';
export * from './lib/types';
export declare function subtreeAdd(options: IOptionsCommon): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
export declare function subtreePush(options: IOptionsCommon): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
export declare function subtreePull(options: IOptionsCommon): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
export declare function subtreeSplit(options: IOptionsSplit): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
declare const _default: typeof import("./index");
export default _default;
