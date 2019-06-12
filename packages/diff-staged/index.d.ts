/**
 * Created by user on 2019/6/13.
 */
export interface IOptions {
    bin?: string;
}
export declare function gitDiffStaged(git_root: string, options?: IOptions): string[];
export declare function gitDiffStagedDir(git_root: string, options?: IOptions): string[];
export declare function gitDiffStagedFile(git_root: string, options?: IOptions): string[];
export default gitDiffStagedFile;
