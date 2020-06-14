/**
 * Created by user on 2020/5/27.
 */
/// <reference types="node" />
import { SpawnASyncReturns, SpawnASyncReturnsPromise, SpawnSyncReturns } from 'cross-spawn-extra/core';
import { crossSpawnOutput } from './lib/util';
import { ISpawnGitSyncOptions, ISpawnGitAsyncOptions } from './lib/types';
export * from './lib/types';
export { crossSpawnOutput };
/**
 * 適用於 git 的 crossSpawnSync
 */
export declare function crossSpawnGitSync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: ISpawnGitSyncOptions): SpawnSyncReturns<T>;
/**
 * 適用於 git 的 crossSpawnAsync
 */
export declare function crossSpawnGitAsync<T extends string | Buffer>(command: string, args?: Array<unknown>, options?: ISpawnGitAsyncOptions): SpawnASyncReturnsPromise<T>;
export declare namespace crossSpawnGitAsync {
    export var async: typeof crossSpawnGitAsync;
    export var sync: typeof crossSpawnGitSync;
    var _a: typeof crossSpawnGitAsync;
    export { _a as default };
}
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
