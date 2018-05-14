/**
 * Created by user on 2018/5/14/014.
 */
export declare const REVISION_DEFAULT = "HEAD";
export interface IOptions {
    cwd?: string;
    realHash?: boolean;
    fullHash?: boolean;
    maxNumber?: number;
}
export declare function revisionRangeData(from: number | string, to?: string, options?: string | IOptions): any;
export declare function revisionRange(from: number | string, to?: string, options?: string | IOptions): any;
export declare function resolveLog(from?: number | string, to?: string, options?: string | IOptions): any;
export declare function resolveRevision(range: number | string, revision?: string, options?: string | IOptions): any;
export declare function getCwd(cwd?: string | IOptions): string;
import * as self from './index';
export default self;
