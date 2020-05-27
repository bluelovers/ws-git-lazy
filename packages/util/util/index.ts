import { realpathSync } from 'fs';
import { resolve } from 'path';

export function getCWD(cwd?: string, realpath?: boolean | getCWD.EnumRealPath, failback?: string | (() => string)): string
{
	if (notEmptyString(cwd))
	{
		//cwd = cwd.trim();
	}
	else if (cwd == null)
	{
		if (typeof failback === 'function')
		{
			cwd = failback();
		}
		else if (notEmptyString(failback))
		{
			cwd = failback;
		}
		else
		{
			return process.cwd()
		}

		if (!notEmptyString(cwd))
		{
			throw new Error(`cwd is ${cwd} by ${failback}`)
		}
	}
	else
	{
		cwd = undefined;
	}

	if (realpath && cwd != null)
	{
		if (realpath === getCWD.EnumRealPath.FS)
		{
			return realpathSync(cwd);
		}

		return resolve(cwd);
	}

	return cwd
}

export declare namespace getCWD
{
	export const enum EnumRealPath
	{
		NONE = 0,
		FS = 1,
		PATH = 2
	}
}

export function notEmptyString(s: string)
{
	return typeof s === 'string' && s.trim() !== ''
}

export default exports as typeof import('./index');

//console.log(getCWD(null, true, 'll'));
