/**
 * Created by user on 2018/5/14/014.
 */

import * as gitlog from 'gitlog';

export const REVISION_DEFAULT = 'HEAD';

export interface IOptions
{
	cwd?: string,
	realHash?: boolean,
	fullHash?: boolean,
}

export function revisionRange(from: number | string, to: string = 'HEAD', options?: string | IOptions)
{
	if (typeof from == 'number')
	{
		({from, to} = resolveRevision(from, to, options));
	}

	return `${from}..${to}`;
}

export function resolveLog(range: number = 20, revision: string = 'HEAD', options?: string | IOptions)
{
	return gitlog({
		repo: getCwd(options),
		number: range + 1,
		branch: `${revision}`,
	});
}

export function resolveRevision(range: number, revision: string = 'HEAD', options?: string | IOptions)
{
	revision = revision || 'HEAD';

	let a = resolveLog(range, revision, options);

	range = a.length;

	let fromName = range > 1 ? `${revision}~${range-1}` : revision;
	let toName = revision;

	let from = fromName;
	let to = toName;

	if (options && ((<IOptions>options).realHash || (<IOptions>options).fullHash))
	{
		if ((<IOptions>options).fullHash)
		{
			from = a[range-1].hash;
			to = a[0].hash;
		}
		else
		{
			from = a[range-1].abbrevHash;
			to = a[0].abbrevHash;
		}
	}

	return {
		from,
		to,

		fromName,
		toName,
	};
}

export function getCwd(cwd?: string | IOptions)
{
	return cwd && (typeof cwd == 'string' ? cwd : (<IOptions>cwd).cwd) || process.cwd();
}

import * as self from './index';
export default self;
