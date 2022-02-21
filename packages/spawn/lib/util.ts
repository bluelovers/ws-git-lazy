/**
 * Created by user on 2020/5/27.
 */

import { crlf } from 'crlf-normalize';
import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, CrossSpawnExtra } from 'cross-spawn-extra/core';

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
	stripAnsi?: boolean,
} = {
	clearEol: true,
}): string
{
	let output = '';

	if (!Buffer.isBuffer(buf) && Array.isArray(buf))
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

	if (options.stripAnsi)
	{
		output = stripAnsi(output);
	}

	output = crlf(output);

	if (options.clearEol || options.clearEol == null)
	{
		output = output.replace(/\n+$/g, '');
	}

	return output;
}

export function filterCrossSpawnArgv<T extends unknown>(args: T[], fn?: (value: T) => boolean)
{
	fn = fn || ((value: T) => typeof value !== 'undefined' && value !== null);

	return args.filter(fn);
}
