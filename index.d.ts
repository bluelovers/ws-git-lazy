/// <reference types="node" />
import { ExecOptions as IExecOptions } from 'child_process';
declare let fields: {
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
};
declare type IFieldsArray = Array<keyof typeof fields | 'status' | 'files'>;
interface IOptions {
    number?: number;
    fields?: IFieldsArray;
    repo?: string;
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
}
declare function gitlog(options: IOptions, cb?: IAsyncCallback): Partial<IParseCommit>[];
interface IParseCommit {
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
    status?: string[];
    files?: string[];
    body?: string;
    rawBody?: string;
    fileStatus?: [string, string][];
}
declare function parseCommits(commits: string[], options: IOptions): Partial<IParseCommit>[];
declare namespace gitlog {
    type IReturnCommits = ReturnType<typeof parseCommits>;
    const KEY_ORDER: string[];
    function sync(options: IOptions): Partial<IParseCommit>[];
    function asyncCallback(options: IOptions, cb: IAsyncCallback): void;
    function async(options: IOptions): Promise<Partial<IParseCommit>[]>;
}
interface IAsyncCallback {
    (error: any, commits: ReturnType<typeof parseCommits>): void;
}
declare const _default: typeof gitlog & {
    gitlog: typeof gitlog;
    default: typeof gitlog;
};
export = _default;
