export declare const REVISION_DEFAULT = "HEAD";
export interface IOptions {
    cwd?: string;
    realHash?: boolean;
    fullHash?: boolean;
}
export declare function revisionRange(from: number | string, to?: string, options?: string | IOptions): string;
export declare function resolveLog(range?: number, revision?: string, options?: string | IOptions): any;
export declare function resolveRevision(range: number, revision?: string, options?: string | IOptions): {
    from: string;
    to: string;
    fromName: string;
    toName: string;
};
export declare function getCwd(cwd?: string | IOptions): string;
import * as self from './index';
export default self;
