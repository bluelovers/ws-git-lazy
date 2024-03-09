/// <reference types="node" />
declare const defaultMsg = "Test commit";
export { defaultMsg };
export interface IOptionsGitDummyCommit {
    cwd?: string;
    defaultMsg?: string;
    silent?: boolean;
    msg?: string | string[];
}
export declare function gitDummyCommit(msg?: string | string[] | IOptionsGitDummyCommit, options?: IOptionsGitDummyCommit): import("cross-spawn-extra").SpawnSyncReturns<string | Buffer>;
export default gitDummyCommit;
