/**
 * Created by user on 2020/6/15.
 */
import { IOptionsGitClone } from '@git-lazy/clone';
export interface IOptionsGitCloneSubDir extends IOptionsGitClone {
    subDir: string;
    targetDir: string;
}
export declare function gitCloneSubDir(remote: string, options: IOptionsGitCloneSubDir): Promise<void>;
export default gitCloneSubDir;
