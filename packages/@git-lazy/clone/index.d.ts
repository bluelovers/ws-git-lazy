/**
 * Created by user on 2020/6/15.
 */
/// <reference types="node" />
export * from './lib/types';
import { IOptionsGitClone, IOptionsGitCloneSync } from './lib/types';
export declare function gitClone(remote: string, options?: IOptionsGitClone): import("cross-spawn-extra").SpawnASyncReturnsPromise<string | Buffer>;
export declare function gitCloneSync(remote: string, options?: IOptionsGitCloneSync): import("cross-spawn-extra").SpawnSyncReturns<string | Buffer>;
export default gitClone;
