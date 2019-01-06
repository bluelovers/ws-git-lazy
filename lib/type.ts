/**
 * Created by user on 2019/1/6/006.
 */

import { SpawnSyncOptions } from "child_process";

export const defaultFields: IFieldsArray = ['abbrevHash', 'hash', 'subject', 'authorName'];
export const defaultOptions: IOptions = {
	number: 10,
	fields: defaultFields,
	nameStatus: true,
	findCopiesHarder: false,
	all: false,
};

export interface IOptions
{
	/**
	 * The number of commits to return.
	 */
	number?: number,
	fields?: IFieldsArray,

	/**
	 * The location of the repo, required field.
	 */
	repo?: string,
	cwd?: string,

	nameStatus?: boolean,

	nameStatusFiles?: boolean,

	/**
	 * Much more likely to set status codes to 'C' if files are exact copies of each other.
	 */
	findCopiesHarder?: boolean,
	/**
	 * Find commits on all branches instead of just on the current one.
	 */
	all?: boolean,
	/**
	 * Specify some options to be passed to the .exec() method:
	 */
	execOptions?: SpawnSyncOptions,

	/**
	 * Show only commits in the specified branch or revision range.
	 */
	branch?: string,
	/**
	 * Show only commits that are enough to explain how the files that match the specified paths came to be.
	 */
	file?: string,

	/**
	 * Show commits more recent than a specific date.
	 */
	since?: string,
	/**
	 * Show commits more recent than a specific date.
	 */
	after?: string,

	/**
	 * Show commits older than a specific date.
	 */
	until?: string,
	/**
	 * Show commits older than a specific date.
	 */
	before?: string,

	/**
	 * Limit the commits output to ones with author/committer header lines that match the specified pattern.
	 */
	committer?: string,
	/**
	 * Limit the commits output to ones with author/committer header lines that match the specified pattern.
	 */
	author?: string,

	returnAllFields?: boolean,

	noMerges?: boolean,
	firstParent?: boolean,

	fnHandleBuffer?(buf: Buffer): string,
}

export const fields = {
	hash: '%H',
	abbrevHash: '%h',
	treeHash: '%T',
	abbrevTreeHash: '%t',
	parentHashes: '%P',
	abbrevParentHashes: '%P',
	authorName: '%an',
	authorEmail: '%ae',
	authorDate: '%ai',
	authorDateRel: '%ar',
	committerName: '%cn',
	committerEmail: '%ce',
	committerDate: '%cd',
	committerDateRel: '%cr',
	subject: '%s',
	body: '%b',
	rawBody: '%B',
	tags: '%D',
};

export interface IParseCommit
{
	hash?: string,
	abbrevHash?: string,
	treeHash?: string,
	abbrevTreeHash?: string,
	parentHashes?: string,
	abbrevParentHashes?: string,
	authorName?: string,
	authorEmail?: string,
	authorDate?: string,
	authorDateRel?: string,
	committerName?: string,
	committerEmail?: string,
	committerDate?: string,
	committerDateRel?: string,
	subject?: string,

	tags?: string[],

	status?: string[],
	files?: string[],

	body?: string,
	rawBody?: string,

	fileStatus?: [string, string][],
}

export type IFieldsArray = Array<keyof typeof fields>

/**
 * for moment
 */
export enum EnumGitDateFormat
{
	AUTHOR_DATE = 'YYYY-MM-DD HH:mm:ss Z',
	COMMITTER_DATE = 'ddd MMM DD HH:mm:ss YYYY ZZ',
	RFC_2822 = 'ddd MMM DD HH:mm:ss YYYY ZZ',
}

export type IReturnCommits = IParseCommit[];

export type ICommands = Array<number | string>

export const KEY_ORDER = [
	'hash',
	'abbrevHash',
	'treeHash',
	'abbrevTreeHash',
	'parentHashes',
	'abbrevParentHashes',
	'authorName',
	'authorEmail',
	'authorDate',
	'authorDateRel',
	'committerName',
	'committerEmail',
	'committerDate',
	'committerDateRel',
	'subject',
	'body',
	'rawBody',
	'tags',
	'status',
	'files',
	'fileStatus',
];
export const delimiter = '\t';
export const notOptFields = ['status', 'files'];

// @ts-ignore
Object.freeze(exports);
