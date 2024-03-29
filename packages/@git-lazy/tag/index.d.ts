/**
 * Created by user on 2020/6/15.
 */
/// <reference types="node" />
import { ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';
export interface IOptions {
    cwd?: string;
    message?: string;
    forceGitTag?: boolean;
    signGitTag?: boolean;
    /**
     * @see https://gitbook.tw/chapters/tag/using-tag
     * @see https://git-tutorial.readthedocs.io/zh/latest/tagging.html
     */
    annotated?: boolean;
    target?: string;
}
export declare function buildCmd(tag: string, options?: IOptions): string[];
export declare function gitTag(tag: string, options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
export declare function gitTagSync(tag: string, options?: IOptions, spawnOptions?: ISpawnGitSyncOptions): import("cross-spawn-extra").SpawnSyncReturns<string | Buffer>;
export default gitTag;
