import { existsSync } from 'fs';
import {
	defaultOptions,
	EnumGitDateFormat,
	fields,
	IOptions,
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
	buildCommands,
} from './lib/util';
import Bluebird = require('bluebird');
import crossSpawn = require('cross-spawn-extra');
import extend = require('lodash.assign');

export { EnumGitDateFormat, IReturnCommits, IParseCommit, IOptions, IFieldsArray, defaultFields, defaultOptions }

export function gitlog(options: IOptions, cb?: IAsyncCallback)
{
	options = handleOptions(options);
	let { bin, commands } = buildCommands(options);

	if (!cb)
	{
		// run Sync
		return parseCommitsStdout(options, crossSpawn.sync(bin, commands, options.execOptions).stdout)
	}

	return crossSpawn.async(bin, commands, options.execOptions)
		.then(function (child)
		{
			let { stdout, stderr, error } = child;

			let commits = parseCommitsStdout(options, stdout);

			let err = stderr && stderr.toString() || error;

			if (err)
			{
				return Bluebird.reject(err)
					.tapCatch(function ()
					{
						return cb(err, commits)
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
	export function sync(options: IOptions)
	{
		return gitlog(options);
	}

	export function asyncCallback(options: IOptions, cb: IAsyncCallback): void
	{
		if (typeof cb !== 'function')
		{
			throw new TypeError();
		}

		// @ts-ignore
		return gitlog(options, cb);
	}

	export function async(options: IOptions)
	{
		return new Promise<ReturnType<typeof parseCommits>>(function (resolve, reject)
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
	}
}

export import sync = gitlog.sync;
export import asyncCallback = gitlog.asyncCallback;
export import async = gitlog.async;

gitlog.gitlog = gitlog;
gitlog.default = gitlog;

export default gitlog

// @ts-ignore
Object.freeze(exports);
