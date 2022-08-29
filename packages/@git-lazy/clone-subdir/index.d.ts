/**
 * Created by user on 2020/6/15.
 */
import { IOptionsGitClone } from '@git-lazy/clone';
export interface IOptionsGitCloneSubDir extends IOptionsGitClone {
    /**
     * sub path for subtree
     */
    subDir: string;
    /**
     * new git dir
     */
    targetDir: string;
    /**
     * default branch when clone
     */
    defaultSourceBranch?: string;
    /**
     * new branch name when done
     */
    newBranch?: string;
}
export declare function gitCloneSubDir(remote: string, options: IOptionsGitCloneSubDir): Promise<void>;
export default gitCloneSubDir;
