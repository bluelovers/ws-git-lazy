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

export interface IOptionsGitFlogsExtra
{
	/**
	 * The number of commits to return.
	 */
	number?: number,

	/**
	 * `-m --first-parent` use with firstParent
	 * 讓合併紀錄可以顯示此合併變動的檔案狀態
	 *
	 * This flag makes the merge commits show the full diff like regular commits;
	 * for each merge parent, a separate log entry and diff is generated.
	 * An exception is that only diff against the first parent is shown when --first-parent option is given;
	 * in that case, the output represents the changes the merge brought into the then-current branch.
	 *
	 * @see https://stackoverflow.com/questions/37801342/using-git-log-to-display-files-changed-during-merge
	 */
	displayFilesChangedDuringMerge?: boolean,
}

export interface IOptionsGitFlogs
{
	nameStatus?: boolean,

	/**
	 * Much more likely to set status codes to 'C' if files are exact copies of each other.
	 */
	findCopiesHarder?: boolean,
	/**
	 * Find commits on all branches instead of just on the current one.
	 */
	all?: boolean,

	/**
	 * Print only merge commits. This is exactly the same as --min-parents=2
	 */
	merges?: boolean,
	/**
	 * Do not print commits with more than one parent. This is exactly the same as --max-parents=1
	 */
	noMerges?: boolean,

	/**
	 * 只返回對主分支的提交歷史
	 *
	 * Follow only the first parent commit upon seeing a merge commit. This option can give a better overview when viewing the evolution of a particular topic branch, because merges into a topic branch tend to be only about adjusting to updated upstream from time to time, and this option allows you to ignore the individual commits brought in to your history by such a merge. Cannot be combined with --bisect.
	 */
	firstParent?: boolean,

	/**
	 * Continue listing the history of a file beyond renames
	 * (works only for a single file).
	 */
	follow?: boolean,

	/**
	 * 较为完整的提交历史
	 * Same as the default mode, but does not prune some history.
	 *
	 * @see https://judes.me/tech/2017/02/06/overwrite-code.html
	 */
	fullHistory?: boolean,
	/**
	 * 最为完整的提交历史
	 * 搭配 fullHistory 使用
	 *
	 * All commits in the simplified history are shown.
	 */
	sparse?: boolean,

	/**
	 * Additional option to --full-history to remove some needless merges from the resulting history, as there are no selected commits contributing to this merge.
	 */
	simplifyMerges?: boolean,
}

export interface IOptionsGitWithValue
{
	/**
	 * Skip number commits before starting to show the commit output.
	 */
	skip?: number,

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
}

/**
 * @see https://cloud.tencent.com/developer/section/1138655
 */
export type IOptions = IOptionsGitFlogs & IOptionsGitWithValue & IOptionsGitFlogsExtra & {

	/**
	 * An array of fields to return from the log
	 */
	fields?: IFieldsArray,

	/**
	 * The location of the repo, required field.
	 */
	repo?: string,
	cwd?: string,

	nameStatusFiles?: boolean,

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
	files?: string[],

	returnAllFields?: boolean,

	fnHandleBuffer?(buf: Buffer): string,
};

/**
 * https://ruby-china.org/topics/939
 * https://git-scm.com/docs/pretty-formats
 */
export const fields: {
	[name in keyof IParseCommitCore]: string
} = {
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
	authorDateUnixTimestamp: '%at',
	committerName: '%cn',
	committerEmail: '%ce',
	committerDate: '%ci',
	committerDateRel: '%cr',
	committerDateUnixTimestamp: '%ct',
	subject: '%s',
	body: '%b',
	rawBody: '%B',
	tags: '%D',

	commitNotes: '%N',

	encoding: '%e',

	refNames: '%D',
};

export interface IParseCommitCore
{
	/**
	 * commit hash
	 */
	hash?: string,
	/**
	 * 缩短的 commit hash
	 */
	abbrevHash?: string,
	treeHash?: string,
	/**
	 * 缩短的 tree hash
	 */
	abbrevTreeHash?: string,
	parentHashes?: string,
	/**
	 * 缩短的 parent hashes
	 */
	abbrevParentHashes?: string,
	authorName?: string,
	authorEmail?: string,
	/**
	 * 日期, ISO 8601 格式
	 * @example 2019-01-06 04:54:09 +0800
	 */
	authorDate?: string,
	/**
	 * 日期, 相对格式(1 day ago)
	 * @example 20 hours ago
	 */
	authorDateRel?: string,
	/**
	 * 日期, UNIX timestamp
	 */
	authorDateUnixTimestamp?: number,
	committerName?: string,
	committerEmail?: string,
	/**
	 * 提交日期, ISO 8601 格式
	 */
	committerDate?: string,
	/**
	 * 提交日期, 相对格式(1 day ago)
	 */
	committerDateRel?: string,
	/**
	 * 提交日期, UNIX timestamp
	 */
	committerDateUnixTimestamp?: number,
	/**
	 * commit 信息标题
	 */
	subject?: string,

	tags?: string[],

	/**
	 * 每個檔案對應的變動狀態
	 * 與 files 內容相對應
	 */
	status?: EnumFileStatus[],
	/**
	 * 每個變動狀態的檔案名稱
	 * 與 status 內容相對應
	 */
	files?: string[],

	/**
	 * commit 信息内容
	 */
	body?: string,
	/**
	 * raw body (subject + body)
	 */
	rawBody?: string,

	commitNotes?: string,

	encoding?: string,

	/**
	 * ref names without the " (", ")" wrapping.
	 * @example HEAD -> master, origin/master
	 */
	refNames?: string,

}

export type IParseCommit = IParseCommitCore & {

	/**
	 * 每個變動狀態的變動狀態與檔案名稱
	 * = status + files
	 */
	fileStatus?: [EnumFileStatus, string][],

	/**
	 * 此 log 出現的原始順序
	 * 作為後期處理時可以額外做判斷的依據
	 */
	_index: number,
}

/**
 * https://git-scm.com/docs/git-status
 */
export enum EnumFileStatus
{
	/**
	 * unmodified
	 */
	UNMODIFIED = ' ',
	/**
	 * modified
	 */
	MODIFIED = 'M',
	/**
	 * added
	 */
	ADDED = 'A',
	/**
	 * deleted
	 */
	DELETED = 'D',
	/**
	 * renamed
	 */
	RENAMED = 'R',
	/**
	 * copied
	 */
	COPIED = 'C',
	/**
	 * updated but unmerged
	 */
	UPDATED_BUT_UNMERGED = 'U',
}

export type IFieldsArray = Array<keyof typeof fields>

/**
 * for moment
 */
export enum EnumGitDateFormat
{
	/**
	 * git style ISO 8601
	 *
	 * @example 2019-01-06 04:54:09 +0800
	 */
	ISO_8601 = 'YYYY-MM-DD HH:mm:ss Z',
	/**
	 * git style RFC 2822
	 */
	RFC_2822 = 'ddd MMM DD HH:mm:ss YYYY ZZ',

	// old version

	AUTHOR_DATE = 'YYYY-MM-DD HH:mm:ss Z',
	COMMITTER_DATE = 'ddd MMM DD HH:mm:ss YYYY ZZ',
}

export type IReturnCommits = IParseCommit[];

export type ICommands = Array<number | string>

export const KEY_ORDER: (keyof IParseCommit)[] = [
	'_index',
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
	'authorDateUnixTimestamp',
	'committerName',
	'committerEmail',
	'committerDate',
	'committerDateRel',
	'committerDateUnixTimestamp',
	'subject',
	'body',
	'rawBody',
	'tags',
	'refNames',
	'status',
	'files',
	'fileStatus',
];
export const delimiter = "\t";
export const notOptFields = ['status', 'files'];

export const enum EnumPrettyFormatFlags
{
	PRETTY = 'pretty',
	FORMAT = 'format',
}

export const enum EnumPrettyFormatMark
{
	BEGIN = '@begin@',

	DELIMITER = '\t',

	END = '@end@',

	JOIN = '',
}

// @ts-ignore
Object.freeze(exports);
