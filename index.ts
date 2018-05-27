/**
 * Created by user on 2018/5/14/014.
 */

import gitlog from 'gitlog2';

export const REVISION_DEFAULT = 'HEAD';

export interface IOptions
{
	cwd?: string,
	realHash?: boolean,
	fullHash?: boolean,
	maxNumber?: number,

	excludeStart?: boolean,
}

export function isRevision(s: string)
{
	if (!/^HEAD|^\d+$/.test(s) && /^\w{7,}$/.test(s))
	{
		return true;
	}

	return false;
}

export function revisionRangeData(from: number | string, to: string = 'HEAD', options: string | IOptions = {})
{
	if (typeof from == 'number' || (((<IOptions>options).realHash || (<IOptions>options).fullHash) && (!isRevision(from) || !isRevision(to))))
	{
		if (typeof from == 'string' && !(<IOptions>options).excludeStart)
		{
			from = revisionBefore(from);

			options = getOptions(options);
			options.excludeStart = true;
		}

		({ from, to } = resolveRevision(from, to, options));
	}

	return { from, to };
}

export function revisionBefore(rev: string, n: number = 1)
{
	if (/^\d+$/.test(rev))
	{
		//
	}
	else if (/~\d+$/.test(rev))
	{
		rev = rev.replace(/(~)(\d+)$/, function (...m)
		{
			return m[1] + (Number(m[2]) + n)
		});
	}
	else if (/^\w+$/.test(rev))
	{
		rev += '~' + n;
	}

	return rev;
}

export function revisionRange(from: number | string, to: string = 'HEAD', options: string | IOptions = {})
{
	({ from, to } = revisionRangeData(from, to, options));

	return `${from}..${to}`;
}

export function resolveLog(from: number | string = 20, to: string = 'HEAD', options: string | IOptions = {}): ReturnType<typeof gitlog>
{
	if (typeof from == 'string')
	{
		return gitlog({
			repo: getCwd(options),
			branch: revisionRange(from, to),

			number: (<IOptions>options).maxNumber || -1,
		});
	}

	return gitlog({
		repo: getCwd(options),
		number: from + 1,
		branch: `${to}`,
	});
}

export function resolveRevision(range: number | string, revision: string = 'HEAD', options: string | IOptions = {})
{
	revision = revision || 'HEAD';

	options = getOptions(options);

	let a = resolveLog(range, revision, options);

	let len = a.length;

	let fromName = (typeof range == 'number' && len > 1) ? `${revision}~${len - 1}` : (typeof range == 'string' ? range : revision);
	let toName = revision;

	let from = fromName;
	let to = toName;

	if (options && ((<IOptions>options).realHash || (<IOptions>options).fullHash))
	{
		if (a.length === 0)
		{
			a = gitlog({
				repo: getCwd(options),
				branch: to,

				number: 1,
			});

			len = a.length;
		}

		if ((<IOptions>options).fullHash)
		{
			from = a[len - 1].hash;
			to = a[0].hash;
		}
		else
		{
			from = a[len - 1].abbrevHash;
			to = a[0].abbrevHash;
		}
	}

	return {
		from,
		to,

		fromName,
		toName,

		length: a.length,
	};
}

export function getOptions(cwd?: string | IOptions): IOptions
{
	if (typeof cwd == 'string')
	{
		return {
			cwd,
		};
	}

	return cwd;
}

export function getCwd(cwd?: string | IOptions)
{
	return cwd && (typeof cwd == 'string' ? cwd : (<IOptions>cwd).cwd) || process.cwd();
}

import * as self from './index';

export default self;
