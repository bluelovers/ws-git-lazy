/**
 * Created by user on 2019/7/6.
 */
/// <reference types="node" />
import { SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
import { ITSRequiredWith } from 'ts-type';
export interface IOptions {
    cwd: string;
    targetPath: string;
    bin?: string;
    force?: boolean;
    yesDoIt?: boolean;
    stdio?: SpawnSyncOptions["stdio"];
}
/**
 * https://stackoverflow.com/a/11764065/4563339
 */
export declare function gitChangeRootDir(options: IOptions): SpawnSyncReturns<string | Buffer>[];
export declare function _core(options: ITSRequiredWith<IOptions, 'targetPath' | 'cwd' | 'force' | 'stdio' | 'bin'>): SpawnSyncReturns<string | Buffer>;
export default gitChangeRootDir;
