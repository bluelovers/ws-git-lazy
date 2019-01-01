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
    /**
     * The number of commits to return.
     */
    number?: number;
    fields?: IFieldsArray;
    /**
     * The location of the repo, required field.
     */
    repo?: string;
    cwd?: string;
    nameStatus?: boolean;
    nameStatusFiles?: boolean;
    /**
     * Much more likely to set status codes to 'C' if files are exact copies of each other.
     */
    findCopiesHarder?: boolean;
    /**
     * Find commits on all branches instead of just on the current one.
     */
    all?: boolean;
    /**
     * Specify some options to be passed to the .exec() method:
     */
    execOptions?: IExecOptions;
    /**
     * Show only commits in the specified branch or revision range.
     */
    branch?: string;
    /**
     * Show only commits that are enough to explain how the files that match the specified paths came to be.
     */
    file?: string;
    /**
     * Show commits more recent than a specific date.
     */
    since?: string;
    /**
     * Show commits more recent than a specific date.
     */
    after?: string;
    /**
     * Show commits older than a specific date.
     */
    until?: string;
    /**
     * Show commits older than a specific date.
     */
    before?: string;
    /**
     * Limit the commits output to ones with author/committer header lines that match the specified pattern.
     */
    committer?: string;
    /**
     * Limit the commits output to ones with author/committer header lines that match the specified pattern.
     */
    author?: string;
    returnAllFields?: boolean;
    noMerges?: boolean;
    firstParent?: boolean;
}
export declare type IFieldsArray = Array<keyof typeof fields>;
export declare function sync(options: IOptions): IParseCommit[];
export declare function asyncCallback(options: IOptions, cb: IAsyncCallback): void;
export declare function async(options: IOptions): Promise<IParseCommit[]>;
/**
 * for moment
 */
export declare enum EnumGitDateFormat {
    AUTHOR_DATE = "YYYY-MM-DD HH:mm:ss Z",
    COMMITTER_DATE = "ddd MMM DD HH:mm:ss YYYY ZZ",
    RFC_2822 = "ddd MMM DD HH:mm:ss YYYY ZZ"
}
interface IAsyncCallback {
    (error: any, commits: ReturnType<typeof parseCommits>): void;
}
export default gitlog;
