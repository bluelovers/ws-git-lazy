/**
 * Created by user on 2019/3/10.
 */
/// <reference types="node" />
import CrossSpawn = require('cross-spawn-extra');
import Bluebird = require('bluebird');
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnSyncReturns } from 'cross-spawn-extra/core';
export * from './types';
/**
 * 適用於 git 的 crossSpawnSync
 */
export declare function crossSpawnSync(command: string, args?: Array<unknown>, options?: SpawnSyncOptions): CrossSpawn.SpawnSyncReturns<Buffer>;
/**
 * 適用於 git 的 crossSpawnAsync
 */
export declare function crossSpawnAsync(command: string, args?: Array<unknown>, options?: SpawnOptions): Bluebird<CrossSpawn.SpawnASyncReturns<Buffer>>;
/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export declare function checkGitOutput<T extends SpawnSyncReturns | SpawnASyncReturns>(cp: T, throwError?: boolean, printStderr?: boolean): T;
declare const _default: typeof import("./git");
export default _default;
