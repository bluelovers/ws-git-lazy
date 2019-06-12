/**
 * Created by user on 2019/6/13.
 */
export interface IOptions {
    bin?: string;
}
export declare function gitUntrackedFile(git_root: string, options?: IOptions): string[];
export declare function gitUntrackedDir(git_root: string, options?: IOptions): string[];
export default gitUntrackedFile;
