/**
 * Created by user on 2019/3/10.
 */
/// <reference types="node" />
import CrossSpawn = require('cross-spawn-extra');
import { sync as crossSpawnSync, async as crossSpawnAsync } from 'cross-spawn-extra';
export * from './types';
export { crossSpawnSync, crossSpawnAsync };
export declare const sync: {
    (command: string): CrossSpawn.SpawnSyncReturns<Buffer>;
    (command: string, options?: CrossSpawn.SpawnSyncOptionsWithStringEncoding): CrossSpawn.SpawnSyncReturns<string>;
    (command: string, options?: CrossSpawn.SpawnSyncOptionsWithBufferEncoding): CrossSpawn.SpawnSyncReturns<Buffer>;
    (command: string, options?: CrossSpawn.SpawnSyncOptions): CrossSpawn.SpawnSyncReturns<Buffer>;
    (command: string, args?: string[], options?: CrossSpawn.SpawnSyncOptionsWithStringEncoding): CrossSpawn.SpawnSyncReturns<string>;
    (command: string, args?: string[], options?: CrossSpawn.SpawnSyncOptionsWithBufferEncoding): CrossSpawn.SpawnSyncReturns<Buffer>;
    (command: string, args?: string[], options?: CrossSpawn.SpawnSyncOptions): CrossSpawn.SpawnSyncReturns<Buffer>;
    <T = Buffer>(...argv: any[]): CrossSpawn.SpawnSyncReturns<T>;
};
export declare const async: {
    <T = Buffer>(command: string, args?: string[], options?: CrossSpawn.SpawnOptions): CrossSpawn.SpawnASyncReturnsPromise<T>;
    <T = Buffer>(command: string, args?: any[], options?: CrossSpawn.SpawnOptions): CrossSpawn.SpawnASyncReturnsPromise<T>;
    <T = Buffer>(...argv: any[]): CrossSpawn.SpawnASyncReturnsPromise<T>;
};
declare const _default: typeof import(".");
export default _default;
