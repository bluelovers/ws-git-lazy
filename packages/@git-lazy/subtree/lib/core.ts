/**
 * Created by user on 2020/6/5.
 */

import { EnumSubtreeCmd, IOptions, IOptionsRuntime, EnumPrefixType } from './types';
import { resolve, normalize, relative } from 'upath2';
import gitRoot from 'git-root2';
import { handlePrefix, inSubPath } from './util';
import crossSpawnGitAsync from '@git-lazy/spawn';
import debug from '@git-lazy/debug';

export function handleOptions(options: IOptions): IOptionsRuntime
{
	let cwd = resolve(options.cwd ?? process.cwd());
	let root = normalize(gitRoot(cwd));

	let { prefix, prefixType } = handlePrefix(options.prefix);
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

	let branch = options.branch ?? 'master';
	let remote = options.remote ?? options.name;

	if (typeof remote !== 'string' || !remote.length)
	{
		throw new TypeError(`remote is not valid: ${remote}`)
	}

	if (typeof branch !== 'string' || !branch.length)
	{
		throw new TypeError(`branch is not valid: ${branch}`)
	}

	return {
		options,
		cwd,
		root,

		remote,
		branch,

		prefixType,
		prefix,
		prefixPath,
	}
}

export function _cmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime)
{
	return crossSpawnGitAsync('git', [
		'subtree',
		cmd,
		opts.remote,
		opts.branch,
		'--prefix',
		opts.prefixPath,
		...(opts.options.squash ? ['--squash'] : []),
	], {
		cwd: opts.root,
		stdio: 'inherit',
	})
}

export function _call(cmd: EnumSubtreeCmd, options: IOptions)
{
	let opts = handleOptions(options)

	return _cmd(cmd, opts)
}
