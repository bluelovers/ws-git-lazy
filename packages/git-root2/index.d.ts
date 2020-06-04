/**
 * Created by user on 2018/5/16/016.
 */
declare function gitRoot(cwd?: string): string;
declare namespace gitRoot {
    var default: typeof gitRoot;
}
declare namespace gitRoot {
    function isGitRoot(target: string): boolean;
    function sync(cwd?: string): string;
    function async(cwd?: string): Promise<string>;
}
export = gitRoot;
