/**
 * Created by user on 2019/3/10.
 */

import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, SpawnOptions, SpawnSyncOptions, CrossSpawnExtra } from 'cross-spawn-extra/core';

import { crlf } from 'crlf-normalize';

export const stripAnsi = CrossSpawnExtra.stripAnsi;

export function getCrossSpawnError<T extends SpawnASyncReturns>(cp: T | any): ISpawnASyncError<T>
{
	return cp.error
		// @ts-ignore
		|| cp.errorCrossSpawn
		;
}

export function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options: {
	clearEol?: boolean,
} = {
	clearEol: true,
}): string
{
	let output = '';

	if (Array.isArray(buf))
	{
		output = buf
			.filter(function (b)
			{
				return !(!b || !b.length)
			})
			.map(function (b)
			{
				return b.toString();
			})
			.join("\n")
	}
	else
	{
		output = (buf || '').toString();
	}

	output = crlf(output);

	if (options.clearEol)
	{
		output = output.replace(/\n+$/g, '');
	}

	return output;
}

export function filterCrossSpawnArgv<T extends unknown>(args: T[], fn?: (value: T) => boolean)
{
	fn = fn || ((value: T) => value != null);

	return args.filter(fn);
}

export default exports as typeof import('./util');
