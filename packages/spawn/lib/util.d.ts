/**
 * Created by user on 2020/5/27.
 */
/// <reference types="node" />
import { SpawnASyncReturns, ISpawnASyncError, SpawnSyncReturns, CrossSpawnExtra } from 'cross-spawn-extra/core';
export declare const stripAnsi: typeof CrossSpawnExtra.stripAnsi;
export declare function getCrossSpawnError<T extends SpawnASyncReturns>(cp: T | any): ISpawnASyncError<T>;
export declare function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options?: {
    clearEol?: boolean;
    stripAnsi?: boolean;
}): string;
export declare function filterCrossSpawnArgv<T extends unknown>(args: T[], fn?: (value: T) => boolean): T[];
