/**
 * Created by user on 2018/5/14/014.
 */
export interface IOptions {
    encoding?: string;
    cwd?: string;
}
export declare const defaultOptions: IOptions;
/**
 * git diff-tree -r --no-commit-id --name-status --encoding=UTF-8  HEAD~1 HEAD
 */
export declare function gitDiffFrom(from?: string | number, to?: string, options?: IOptions): {
    status: string;
    path: string;
    fullpath: string;
}[] & {
    from: string | number;
    to: string;
    cwd: string;
    root: string;
};
export declare function filterArgv(argv: string[]): string[];
export default gitDiffFrom;
