import { EnumSubtreeCmd, IOptionsCommon, IOptionsSplit } from './lib/types';
import { _call } from './lib/core';
import { _callSplit } from './lib/core/split';

export * from './lib/types';

export async function subtreeAdd(options: IOptionsCommon)
{
	return _call(EnumSubtreeCmd.add, options)
}

export async function subtreePush(options: IOptionsCommon)
{
	return _call(EnumSubtreeCmd.push, options)
}

export async function subtreePull(options: IOptionsCommon)
{
	return _call(EnumSubtreeCmd.pull, options)
}

export async function subtreeSplit(options: IOptionsSplit)
{
	return _callSplit(EnumSubtreeCmd.split, options)
}

export default exports as typeof import('./index');
