/**
 * Created by user on 2020/6/5.
 */

import { normalize } from 'upath2';
import { isAbsolute } from "path";
import { EnumPrefixType } from './types';

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
