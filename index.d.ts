/**
 * Created by user on 2018/5/14/014.
 */
import gitlog, { IOptions as IGitlogOptions } from 'gitlog2';
export declare const REVISION_DEFAULT = "HEAD";
export interface IOptions {
    cwd?: string;
    realHash?: boolean;
    fullHash?: boolean;
    maxNumber?: number;
    excludeStart?: boolean;
    gitlogOptions?: IGitlogOptions;
}
export { IGitlogOptions };
export declare function isRevision(s: string): boolean;
export declare function revisionRangeData(from: number | string, to?: string, options?: string | IOptions): {
    from: string;
    to: string;
};
export declare function revisionBefore(rev: string, n?: number): string;
export declare function revisionRange(from: number | string, to?: string, options?: string | IOptions): string;
export declare function resolveLog(from?: number | string, to?: string, options?: string | IOptions): ReturnType<typeof gitlog>;
export declare function resolveRevision(range: number | string, revision?: string, options?: string | IOptions): {
    from: string;
    to: string;
    fromName: string;
    toName: string;
    length: number;
};
export declare function getOptions(cwd?: string | IOptions): IOptions;
export declare function getCwd(cwd?: string | IOptions): string;
import * as self from './index';
export default self;
