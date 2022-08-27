import { IOptionsCommon, IOptionsRuntime, IOptionsSplit, IOptionsCore, EnumSubtreeCmd } from '../types';
import { handleGitPath } from '../util/git';
import { handlePrefix, handlePrefixPath, assertString } from '../util';
import { handleOptions, _cmd } from '../core';
import { crossSpawnGitAsync } from '@git-lazy/spawn';

export function assertValueSplit<O extends IOptionsSplit = IOptionsSplit>(optionsRuntime: IOptionsRuntime<O> | any): asserts optionsRuntime is IOptionsRuntime<O>
{
	//assertString(optionsRuntime.branch, 'branch');
}

export function handleValueSplit<O extends IOptionsSplit = IOptionsSplit>(options: O | any): O
{
	return options
}

export function handleOptionsSplit<O extends IOptionsSplit = IOptionsSplit>(options: O): IOptionsRuntime<O>
{
	let handlers = options.handlers ?? {};

	return handleOptions<O>({
		...options,
		handlers: {
			...handlers,
			assertValue: handlers.assertValue || assertValueSplit,
			handleValue: handlers.handleValue || handleValueSplit,
		}
	})
}

export function unparseCmdSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, opts: IOptionsRuntime<O>)
{
	return [
		'subtree',
		cmd,
		...(opts.branch ? ['-b', opts.branch] : []),
		'--prefix',
		opts.prefixPath,
		...(opts.options.rejoin ? ['--rejoin'] : []),
		...(opts.options.ignoreJoins ? ['--ignore-joins'] : []),
	]
}

export function _cmdSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, opts: IOptionsRuntime<O>)
{
	return crossSpawnGitAsync('git', unparseCmdSplit(cmd, opts), {
		cwd: opts.root,
		stdio: 'inherit',
	})
}

export function _callSplit<O extends IOptionsSplit = IOptionsSplit>(cmd: EnumSubtreeCmd.split, options: O)
{
	let opts = handleOptionsSplit(options)

	return _cmdSplit(cmd, opts)
}
