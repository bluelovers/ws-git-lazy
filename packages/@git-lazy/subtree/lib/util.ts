/**
 * Created by user on 2020/6/5.
 */

import { normalize, resolve, relative } from 'upath2';
import { isAbsolute } from "path";
import { EnumPrefixType, IOptionsHandlePrefixPath, IReturnTypeHandlePrefixPath } from './types';

export function handlePrefix(prefix: string)
{
	const bool = /^\.[\/\\]/.test(prefix);

	prefix = normalize(prefix);

	if (bool && !prefix.startsWith('../'))
	{
		prefix = './' + prefix;
	}

	let prefixType: EnumPrefixType = EnumPrefixType.ROOT;

	if (/^\/[^\/]/.test(prefix))
	{
		prefix = prefix.slice(1);
	}
	else if (prefix.startsWith('../') || prefix.startsWith('./'))
	{
		prefixType = EnumPrefixType.RELATIVE;
	}
	else if (isAbsolute(prefix))
	{
		prefixType = EnumPrefixType.ABSOLUTE;
	}

	return {
		prefixType,
		prefix,
	}
}

export function inSubPath(sub: string, root: string)
{
	let r = normalize(root)
	let s = normalize(sub)

	return s.indexOf(r) === 0 && s.length > r.length
}

export function handlePrefixPath(options: IOptionsHandlePrefixPath): IReturnTypeHandlePrefixPath
{
	let {
		prefix,
		prefixType,
		root,
		cwd,
	} = options;
	let prefixPath = prefix;

	if (prefixType !== EnumPrefixType.ROOT)
	{
		prefixPath = resolve(cwd, prefix)

		if (inSubPath(prefixPath, root))
		{
			prefixPath = relative(root, prefixPath)
		}
		else
		{
			throw new Error(`prefix path is not allow: ${prefixPath}`)
		}
	}

	return {
		prefixPath,

		prefix,
		prefixType,
		root,
		cwd,
	}
}

export function assertString(value: any, name?: string): asserts value is string
{
	if (typeof value !== 'string' || !value.length)
	{
		throw new TypeError(`${name ?? 'value'} is not valid: ${value}`)
	}
}
