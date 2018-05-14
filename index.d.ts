/// <reference types="node" />
import { ExecOptions as IExecOptions } from 'child_process';
export = gitlog;
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
interface IAsyncCallback {
    (error: any, commits: ReturnType<typeof parseCommits>): void;
}
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
}
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
    status?: string[];
    files?: string[];
    body?: string;
    rawBody?: string;
    fileStatus?: [string, string][];
}
declare function parseCommits(commits: string[], options: IOptions): IParseCommit[];
