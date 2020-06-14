export declare function gitRoot(cwd?: string): string;
export declare namespace gitRoot {
    export var isGitRoot: typeof import("./core").isGitRoot;
    export var sync: typeof import("./core").sync;
    export var async: typeof import("./core").async;
    var _a: typeof gitRoot;
    export { _a as default };
}
export declare function isGitRoot(target: string): boolean;
export declare function sync(cwd?: string): string;
export declare function async(cwd?: string): Promise<string>;
export default gitRoot;
