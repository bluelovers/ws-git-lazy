/**
 * Created by user on 2022/4/6.
 */
import { SpawnSyncReturns } from 'cross-spawn-extra';
import { crlf } from 'crlf-normalize';
import { stripAnsiValue } from '@lazy-spawn/strip-ansi';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export function crossSpawnOutput(buf: SpawnSyncReturns["output"] | ITSValueOrArray<Buffer | string>, options: {
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
		output = stripAnsiValue(output);
	}

	output = crlf(output);

	if (options.clearEol || options.clearEol == null)
	{
		output = output.replace(/\n+$/g, '');
	}

	return output;
}

export default crossSpawnOutput
