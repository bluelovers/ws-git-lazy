export declare function getCWD(cwd?: string, realpath?: boolean | getCWD.EnumRealPath, failback?: string | (() => string)): string;
export declare namespace getCWD {
    const enum EnumRealPath {
        NONE = 0,
        FS = 1,
        PATH = 2
    }
}
export declare function notEmptyString(s: string): boolean;
declare const _default: typeof import(".");
export default _default;
