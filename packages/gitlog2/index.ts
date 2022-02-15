import { existsSync } from 'fs';
import {
	defaultOptions,
	EnumGitDateFormat,
	EnumGitDateFormat as _EnumGitDateFormat,
	fields,
	IOptions, IOptionsGitFlogs, IOptionsGitWithValue, IOptionsGitFlogsExtra,
	IParseCommit,
	IReturnCommits,
	IFieldsArray,
	ICommands, notOptFields, delimiter,
	defaultFields,
} from './lib/type';
import {
	addOptional,
	debug,
	IAsyncCallback,
	parseCommits,
	parseCommitsStdout,
	handleOptions,
	buildCommands, createError,
} from './lib/util';
import Bluebird from 'bluebird';
import crossSpawn from 'cross-spawn-extra';
import extend from 'lodash.assign';
import { crossSpawnGitSync, crossSpawnGitAsync } from '@git-lazy/spawn';

export { EnumGitDateFormat, IReturnCommits, IParseCommit, IFieldsArray, defaultFields, defaultOptions }
export { IOptions, IOptionsGitFlogs, IOptionsGitWithValue, IOptionsGitFlogsExtra, }

export function gitlog(options: IOptions): IParseCommit[]
export function gitlog(options: IOptions, cb: IAsyncCallback): Bluebird<IParseCommit[]>
export function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[] | Bluebird<IParseCommit[]>
export function gitlog(options: IOptions, cb?: IAsyncCallback): IParseCommit[] | Bluebird<IParseCommit[]>
{
	options = handleOptions(options);
	let { bin, commands } = buildCommands(options);

	if (!cb)
	{
		// run Sync
		return parseCommitsStdout(options, crossSpawnGitSync(bin, commands, options.execOptions as any).stdout as any)
	}

	return crossSpawnGitAsync(bin, commands, options.execOptions as any)
		.then(function (child)
		{
			let { stdout, stderr, error } = child;

			let commits = parseCommitsStdout(options, stdout as any);

			let err = stderr && stderr.toString() || error || null;

			if (err)
			{
				let e = createError(err, {
					bin,
					commands,
					child,
					commits,
				});

				return Bluebird.reject(err)
					.tapCatch(function ()
					{
						return cb(e, commits)
					})
					;
			}
			else
			{
				return Bluebird.resolve(commits)
					.tap(function ()
					{
						return cb(null, commits)
					})
			}
		})
		;
}

export namespace gitlog
{
	/**
	 * this method can make sure u are use sync mode
	 */
	export function sync(options: IOptions)
	{
		return gitlog(options);
	}

	/**
	 * allow `await` when use `callback` mode,
	 * but remember u can't change `return value` when use `callback`
	 */
	export function asyncCallback(options: IOptions, cb: IAsyncCallback)
	{
		if (typeof cb !== 'function')
		{
			throw new TypeError(`expected cb as function`);
		}

		// @ts-ignore
		return gitlog(options, cb);
	}

	/**
	 * async Promise mode
	 */
	export function async(options: IOptions)
	{
		return gitlog(options, dummy);

		/*
		return new Bluebird<IReturnCommits>(function (resolve, reject)
		{
			gitlog(options, function (error, commits)
			{
				if (error)
				{
					reject(error)
				}
				else
				{
					resolve(commits)
				}
			})
		});
		*/
	}

	/**
	 * for trigger async Promise mode
	 */
	function dummy() {}

	export const EnumGitDateFormat = _EnumGitDateFormat
}

export import sync = gitlog.sync;
export import asyncCallback = gitlog.asyncCallback;
export import async = gitlog.async;

gitlog.gitlog = gitlog;
gitlog.default = gitlog;

export default gitlog
