/**
 * Created by user on 2020/5/27.
 */

import { CrossSpawnExtra, ISpawnASyncError, SpawnASyncReturns } from 'cross-spawn-extra';
export { stripAnsiValue as stripAnsi } from '@lazy-spawn/strip-ansi';

export function getCrossSpawnError<T extends SpawnASyncReturns>(cp: T | any): ISpawnASyncError<T>
{
	return cp.error
		// @ts-ignore
		|| cp.errorCrossSpawn
		;
}

export function filterCrossSpawnArgv<T extends unknown>(args: T[], fn?: (value: T) => boolean)
{
	fn = fn || ((value: T) => typeof value !== 'undefined' && value !== null);

	return args.filter(fn);
}
