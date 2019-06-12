/**
 * Created by user on 2019/3/10.
 */
/// <reference types="node" />
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnASyncReturnsPromise, SpawnSyncReturns } from 'cross-spawn-extra/core';
export * from './types';
/**
 * 適用於 git 的 crossSpawnSync
 */
export declare function crossSpawnSync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: SpawnSyncOptions): SpawnSyncReturns<T>;
/**
 * 適用於 git 的 crossSpawnAsync
 */
export declare function crossSpawnAsync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: SpawnOptions): SpawnASyncReturnsPromise<T>;
/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export declare function checkGitOutput<T extends SpawnSyncReturns<string | Buffer> | SpawnASyncReturns<string | Buffer>>(cp: T, throwError?: boolean, printStderr?: boolean): T;
export declare const sync: typeof crossSpawnSync;
export declare const async: typeof crossSpawnAsync;
declare const _default: typeof import("./git");
export default _default;
