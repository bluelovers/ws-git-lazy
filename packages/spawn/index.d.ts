/**
 * Created by user on 2020/5/27.
 */
/// <reference types="node" />
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnASyncReturnsPromise, SpawnSyncReturns } from 'cross-spawn-extra/core';
export * from './lib/types';
/**
 * 適用於 git 的 crossSpawnSync
 */
export declare function crossSpawnGitSync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: SpawnSyncOptions): SpawnSyncReturns<T>;
/**
 * 適用於 git 的 crossSpawnAsync
 */
export declare function crossSpawnGitAsync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: SpawnOptions): SpawnASyncReturnsPromise<T>;
/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export declare function checkGitOutput<T extends SpawnSyncReturns<string | Buffer> | SpawnASyncReturns<string | Buffer>>(cp: T, throwError?: boolean, printStderr?: boolean): T;
export { crossSpawnGitSync as sync };
export { crossSpawnGitAsync as async };
export default crossSpawnGitAsync;
