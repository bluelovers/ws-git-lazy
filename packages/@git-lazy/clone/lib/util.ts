/**
 * Created by user on 2020/6/15.
 */

import { resolve } from "path";
import lazyUnParse from '@git-lazy/util-args';
import { IOptionsGitClone, IOptionsGitCloneSync } from './types';
import { defaultsDeep } from 'lodash';

export function handleOptions<T extends IOptionsGitClone | IOptionsGitCloneSync>(remote: string, options?: T)
{
	options = {
		...options,
	};

	options.cwd = options.cwd ?? process.cwd();

	if (options.targetDir?.length > 0)
	{
		options.targetDir = resolve(options.cwd, options.targetDir)
	}

	options = defaultsDeep(options, {
		cloneOptions: {
			depth: 50,
			singleBranch: true,
		},
	} as IOptionsGitClone)

	return {
		remote,
		options,
	}
}

export function gitCloneCmd(remote: string, options?: IOptionsGitClone)
{
	({ remote, options } = handleOptions(remote, options));

	const args = [
		'clone',
		remote,
	]

	if (options.targetDir?.length > 0)
	{
		args.push(options.targetDir)
	}

	let ls = lazyUnParse(options.cloneOptions ?? {})

	if (ls.length)
	{
		args.push(...ls)
	}

	return args
}
