/**
 * Created by user on 2019/3/10.
 */

import CrossSpawn = require('cross-spawn-extra');
import Bluebird = require('bluebird');
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, CrossSpawnExtra } from 'cross-spawn-extra/core';
import { crossSpawnOutput, stripAnsi } from './util';
import { console, debugConsole } from '../log';

export * from './types';

export function crossSpawnSync(command: string, args?: Array<unknown>, options?: SpawnSyncOptions)
{
	let print: boolean;

	if (options)
	{
		if (options.stdio == 'inherit')
		{
			print = true;
			delete options.stdio
		}
	}

	let cp = CrossSpawn.sync(command, args, options);

	print && console.log(crossSpawnOutput(cp.output));

	checkGitOutput(cp);

	return cp;
}

export function crossSpawnAsync(command: string, args?: Array<unknown>, options?: SpawnOptions)
{
	return CrossSpawn.async(command, args, options)
		.then(checkGitOutput)
	;
}

/**
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export function checkGitOutput<T extends SpawnSyncReturns | SpawnASyncReturns>(cp: T, throwError?: boolean, printStderr?: boolean)
{
	if (cp.stderr && cp.stderr.length)
	{
		let s1 = String(cp.stderr);
		let s2 = stripAnsi(s1);

		if (/^fatal\:/im.test(s2) || /^unknown option:/i.test(s2))
		{
			let e = new Error(s1);

			cp.error = cp.error || e;
			// @ts-ignore
			cp.errorCrossSpawn = e;

			if (throwError)
			{
				throw e
			}
		}

		if (printStderr)
		{
			debugConsole.info(`cp.stderr`);
			debugConsole.warn(s1);
		}
	}

	return cp;
}

export default exports as typeof import('./git');
