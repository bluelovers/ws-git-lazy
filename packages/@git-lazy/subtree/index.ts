import { EnumSubtreeCmd, IOptions } from './lib/types';
import { _call } from './lib/core';

export * from './lib/types';

export async function subtreeAdd(options: IOptions)
{
	return _call(EnumSubtreeCmd.add, options)
}

export async function subtreePush(options: IOptions)
{
	return _call(EnumSubtreeCmd.push, options)
}

export async function subtreePull(options: IOptions)
{
	return _call(EnumSubtreeCmd.pull, options)
}

export default exports as typeof import('./index');
