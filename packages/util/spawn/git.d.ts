/**
 * Created by user on 2019/3/10.
 */
/// <reference types="node" />
import CrossSpawn = require('cross-spawn-extra');
import Bluebird = require('bluebird');
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnSyncReturns } from 'cross-spawn-extra/core';
export * from './types';
export declare function crossSpawnSync(command: string, args?: Array<unknown>, options?: SpawnSyncOptions): CrossSpawn.SpawnSyncReturns<Buffer>;
export declare function crossSpawnAsync(command: string, args?: Array<unknown>, options?: SpawnOptions): Bluebird<CrossSpawn.SpawnASyncReturns<Buffer>>;
/**
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export declare function checkGitOutput<T extends SpawnSyncReturns | SpawnASyncReturns>(cp: T, throwError?: boolean, printStderr?: boolean): T;
declare const _default: typeof import("./git");
export default _default;
