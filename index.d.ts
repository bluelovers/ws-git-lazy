/// <reference types="node" />
import { ExecOptions as IExecOptions } from 'child_process';
const fields: {
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
import IOptions = gitlog.IOptions;
declare function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[];
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
    tags?: string[];
    status?: string[];
    files?: string[];
    body?: string;
    rawBody?: string;
    fileStatus?: [string, string][];
}
function parseCommits(commits: string[], options: IOptions): IParseCommit[];
declare namespace gitlog {
    type IReturnCommits = ReturnType<typeof parseCommits>;
    const defaultFields: IFieldsArray;
    const defaultOptions: IOptions;
    const KEY_ORDER: string[];
    interface IOptions {
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
    }
    type IFieldsArray = Array<keyof typeof fields>;
    function sync(options: IOptions): IParseCommit[];
    function asyncCallback(options: IOptions, cb: IAsyncCallback): void;
    function async(options: IOptions): Promise<IParseCommit[]>;
}
interface IAsyncCallback {
    (error: any, commits: ReturnType<typeof parseCommits>): void;
}
declare const _default: typeof gitlog & {
    gitlog: typeof gitlog;
    default: typeof gitlog;
};
export = _default;
