/**
 * Created by user on 2020/6/5.
 */

import {
	EnumSubtreeCmd,
	IOptionsCommon,
	IOptionsRuntime,
	IOptionsCore,
	IOptionsCoreWithHandlers,
	IOptionsSplit, IOptions,
} from './types';
import { handlePrefix, assertString, handlePrefixPath } from './util';
import crossSpawnGitAsync from '@git-lazy/spawn';
import { handleGitPath } from './util/git';

export function handleOptions<O extends IOptions = IOptionsCommon>(options: O): IOptionsRuntime<O>
{
	let { cwd, root } = handleGitPath(options);

	let { prefix, prefixType } = handlePrefix(options.prefix);

	let { prefixPath } = (options.handlers?.handlePrefixPath ?? handlePrefixPath)({
		prefix,
		prefixType,
		root,
		cwd,
	});

	let options2 = {
		...options,
	}

	if (options.handlers?.handleValue)
	{
		options = options.handlers.handleValue(options2 as any) as O;
	}
	else
	{
		options2.branch = options2.branch ?? 'master';
		options2.remote = options2.remote ?? options2.name;
	}

	let { remote, branch, } = options2;

	let data: IOptionsRuntime<O> = {
		options,
		cwd,
		root,

		remote,
		branch,

		prefixType,
		prefix,
		prefixPath,
	}

	if (options.handlers?.assertValue)
	{
		options.handlers.assertValue(data as any)
	}
	else
	{
		assertString(data.remote, 'remote');
		assertString(data.branch, 'branch');
	}

	assertString(data.root, 'root');
	assertString(data.prefixPath, 'prefix');

	return data
}

export function unparseCmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime)
{
	return [
		'subtree',
		cmd,
		opts.remote,
		opts.branch,
		'--prefix',
		opts.prefixPath,
		...(opts.options.squash ? ['--squash'] : []),
	]
}

export function _cmd(cmd: EnumSubtreeCmd, opts: IOptionsRuntime)
{
	return crossSpawnGitAsync('git', unparseCmd(cmd, opts), {
		cwd: opts.root,
		stdio: 'inherit',
	})
}

export function _call(cmd: EnumSubtreeCmd, options: IOptionsCommon)
{
	let opts = handleOptions(options)

	return _cmd(cmd, opts)
}
