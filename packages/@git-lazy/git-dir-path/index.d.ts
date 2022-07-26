export interface IOptionsFindGitDir {
    cwd?: string;
    env?: Record<string, string>;
    throwIfNoEntry?: boolean;
}
export declare function findGitDir(options?: IOptionsFindGitDir): string;
export declare function findGitDirAsync(options?: IOptionsFindGitDir): Promise<string>;
export default findGitDir;
