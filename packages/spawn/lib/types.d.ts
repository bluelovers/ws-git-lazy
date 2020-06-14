/**
 * Created by user on 2019/3/10.
 */
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnSyncReturns } from 'cross-spawn-extra/core';
export { SpawnSyncOptions, SpawnOptions, SpawnASyncReturns, SpawnSyncReturns };
export interface IOptionsCheck {
    throwError?: boolean;
    printStderr?: boolean;
}
export interface ISpawnGitSyncOptions extends SpawnSyncOptions, IOptionsCheck {
}
export interface ISpawnGitAsyncOptions extends SpawnOptions, IOptionsCheck {
}
