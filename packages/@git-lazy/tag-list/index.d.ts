/// <reference types="bluebird" />
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
export declare const enum EnumSort {
    committerdate = "committerdate",
    taggerdate = "taggerdate"
}
export interface IOptions {
    cwd?: string;
    sort?: string | ITSTypeAndStringLiteral<EnumSort>;
    /**
     * when set `null` will return all tags
     *
     * @default 'HEAD~20'
     */
    target?: string | 'master' | 'main' | 'HEAD' | 'HEAD~20' | null;
    merged?: string | 'master' | 'main' | 'HEAD';
}
export declare function buildCmd(options?: IOptions): string[];
/**
 * @see https://gist.github.com/rponte/fdc0724dd984088606b0
 */
export declare function gitTagList(options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions): import("bluebird")<[string, Date][]>;
export declare function gitTagListSync(options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions): [string, Date][];
export declare function _handleResult(list: string[]): [string, Date][];
export default gitTagList;
