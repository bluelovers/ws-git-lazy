/**
 * Created by user on 2019/6/13.
 */
import gitRoot from 'git-root2';
export { gitRoot };
export declare function hasGit(cwd: string): string;
export declare function isGitRoot(cwd: string, realpath?: boolean): boolean;
export default gitRoot;
