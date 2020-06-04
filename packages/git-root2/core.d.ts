export declare function gitRoot(cwd?: string): string;
export declare namespace gitRoot {
    var isGitRoot: typeof import("./core").isGitRoot;
    var sync: typeof import("./core").sync;
    var async: typeof import("./core").async;
    var default: typeof gitRoot;
}
export declare function isGitRoot(target: string): boolean;
export declare function sync(cwd?: string): string;
export declare function async(cwd?: string): Promise<string>;
export default gitRoot;
