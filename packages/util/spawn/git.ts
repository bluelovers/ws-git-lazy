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

/**
 * 適用於 git 的 crossSpawnSync
 */
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

/**
 * 適用於 git 的 crossSpawnAsync
 */
export function crossSpawnAsync(command: string, args?: Array<unknown>, options?: SpawnOptions)
{
	return CrossSpawn.async(command, args, options)
		.then(checkGitOutput)
	;
}

/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export function checkGitOutput<T extends SpawnSyncReturns | SpawnASyncReturns>(cp: T, throwError?: boolean, printStderr?: boolean)
{
	let s1: string;

	if (cp.error)
	{
		// @ts-ignore
		cp.errorCrossSpawn = cp.errorCrossSpawn || cp.error;
	}
	else if (cp.stderr && cp.stderr.length)
	{
		s1 = String(cp.stderr);

		if (!cp.error)
		{
			let s2 = stripAnsi(s1);

			if (/^fatal\:/im.test(s2) || /^unknown option:/i.test(s2))
			{
				let e = new Error(s1) as ISpawnASyncError;

				// @ts-ignore
				e.child = cp;

				cp.error = cp.error || e;
				// @ts-ignore
				cp.errorCrossSpawn = cp.errorCrossSpawn || e;
			}
		}
	}

	if (throwError && cp.error)
	{
		throw cp.error
	}

	if (printStderr && s1 != null)
	{
		debugConsole.info(`cp.stderr`);
		debugConsole.warn(s1);
	}

	return cp;
}

export default exports as typeof import('./git');
