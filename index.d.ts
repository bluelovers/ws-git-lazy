export interface IOptions {
    encoding?: string;
    cwd?: string;
}
export declare const defaultOptions: IOptions;
export declare function gitDiffFrom(from?: string | number, to?: string, options?: IOptions): {
    status: string;
    path: string;
    fullpath: string;
}[];
export declare function filterArgv(argv: string[]): string[];
export default gitDiffFrom;
