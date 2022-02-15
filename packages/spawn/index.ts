/**
 * Created by user on 2020/5/27.
 */

import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import {
	SpawnASyncReturns,
	SpawnASyncReturnsPromise,
	ISpawnASyncError,
	SpawnSyncReturns,
	CrossSpawnExtra,
} from 'cross-spawn-extra/core';
import { console, debugConsole, debug } from '@git-lazy/debug';
import { crossSpawnOutput, stripAnsi } from './lib/util';
import { sync as CrossSpawnSync, async as CrossSpawnASync } from 'cross-spawn-extra';
import { ISpawnGitSyncOptions, ISpawnGitAsyncOptions } from './lib/types';
import promiseTapLazy from 'promise-tap-then-catch';

export * from './lib/types';

export { crossSpawnOutput }

const SymbolRawArgv = Symbol.for('argv');

export { SymbolRawArgv }

/**
 * 適用於 git 的 crossSpawnSync
 */
export function crossSpawnGitSync<T extends string | Buffer>(command: string,
	args?: Array<unknown>,
	options?: ISpawnGitSyncOptions,
): SpawnSyncReturns<T>
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

	debug.log(command, args, options);

	let cp = CrossSpawnSync<T>(command, args, options);

	cp[SymbolRawArgv] = {
		command,
		args,
		options,
	};

	// @ts-ignore
	print && console.log(crossSpawnOutput(cp.output));

	checkGitOutput(cp, options?.throwError, options?.printStderr);

	return cp;
}

/**
 * 適用於 git 的 crossSpawnAsync
 */
export function crossSpawnGitAsync<T extends string | Buffer>(command: string,
	args?: Array<unknown>,
	options?: ISpawnGitAsyncOptions,
): SpawnASyncReturnsPromise<T>
{
	debug.log(command, args, options);

	return promiseTapLazy(CrossSpawnASync<T>(command, args, options)
		.then(cp => checkGitOutput(cp, options?.throwError, options?.printStderr)), cp =>
	{
		cp[SymbolRawArgv] = {
			command,
			args,
			options,
		}
	});
}

/**
 * 檢查 git 輸出訊息來判斷指令是否成功或錯誤
 *
 * because git output log has bug
 * when error happen didn't trigger cp.error
 */
export function checkGitOutput<T extends SpawnSyncReturns<string | Buffer> | SpawnASyncReturns<string | Buffer>>(cp: T,
	throwError?: boolean,
	printStderr?: boolean,
)
{
	let s1: string;
	throwError = throwError ?? true;

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

	// @ts-ignore
	if (!cp.error && cp.exitCode)
	{
		// @ts-ignore
		cp.error = new Error(`Process finished with exit code ${cp.exitCode}`)
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

export { crossSpawnGitSync as sync };
export { crossSpawnGitAsync as async };

crossSpawnGitAsync.async = crossSpawnGitAsync;
crossSpawnGitAsync.sync = crossSpawnGitSync;

crossSpawnGitAsync.default = crossSpawnGitAsync;

export default crossSpawnGitAsync
