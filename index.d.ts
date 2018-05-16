/**
 * Created by user on 2018/5/16/016.
 */
declare function gitRoot(cwd?: string): string;
declare namespace gitRoot {
    function isGitRoot(target: string): boolean;
    function async(cwd?: string): Promise<string>;
}
declare const _default: typeof gitRoot & {
    gitRoot(cwd?: string): string;
    default(cwd?: string): string;
    async(cwd?: string): Promise<string>;
};
export = _default;
