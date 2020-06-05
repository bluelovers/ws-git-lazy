/// <reference types="node" />
import { IOptions } from './lib/types';
export * from './lib/types';
export declare function subtreeAdd(options: IOptions): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
export declare function subtreePush(options: IOptions): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
export declare function subtreePull(options: IOptions): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer>>;
declare const _default: typeof import(".");
export default _default;
