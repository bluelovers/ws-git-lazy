/// <reference types="node" />
import { ExecOptions as IExecOptions } from 'child_process';
declare const fields: {
    hash: string;
    abbrevHash: string;
    treeHash: string;
    abbrevTreeHash: string;
    parentHashes: string;
    abbrevParentHashes: string;
    authorName: string;
    authorEmail: string;
    authorDate: string;
    authorDateRel: string;
    committerName: string;
    committerEmail: string;
    committerDate: string;
    committerDateRel: string;
    subject: string;
    body: string;
    rawBody: string;
    tags: string;
};
export declare function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[];
export interface IParseCommit {
    hash?: string;
    abbrevHash?: string;
    treeHash?: string;
    abbrevTreeHash?: string;
    parentHashes?: string;
    abbrevParentHashes?: string;
    authorName?: string;
    authorEmail?: string;
    authorDate?: string;
    authorDateRel?: string;
    committerName?: string;
    committerEmail?: string;
    committerDate?: string;
    committerDateRel?: string;
    subject?: string;
    tags?: string[];
    status?: string[];
    files?: string[];
    body?: string;
    rawBody?: string;
    fileStatus?: [string, string][];
}
export declare function parseCommits(commits: string[], options: IOptions): IParseCommit[];
export declare type IReturnCommits = ReturnType<typeof parseCommits>;
export declare const defaultFields: IFieldsArray;
export declare const defaultOptions: IOptions;
export declare const KEY_ORDER: string[];
export interface IOptions {
    number?: number;
    fields?: IFieldsArray;
    repo?: string;
    cwd?: string;
    nameStatus?: boolean;
    nameStatusFiles?: boolean;
    findCopiesHarder?: boolean;
    all?: boolean;
    execOptions?: IExecOptions;
    branch?: string;
    file?: string;
    author?: string;
    since?: string;
    after?: string;
    until?: string;
    before?: string;
    committer?: string;
    returnAllFields?: boolean;
    noMerges?: boolean;
    firstParent?: boolean;
}
export declare type IFieldsArray = Array<keyof typeof fields>;
export declare function sync(options: IOptions): IParseCommit[];
export declare function asyncCallback(options: IOptions, cb: IAsyncCallback): void;
export declare function async(options: IOptions): Promise<IParseCommit[]>;
interface IAsyncCallback {
    (error: any, commits: ReturnType<typeof parseCommits>): void;
}
export default gitlog;
