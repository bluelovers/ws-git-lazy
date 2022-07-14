/**
 * Created by user on 2019/7/6.
 */

import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
import { handleSpawnOutputArray } from '@git-lazy/util/spawn/data';
import { hasGit, isGitRoot } from '@git-lazy/root';
import FastGlob, { Options, EntryItem } from '@bluelovers/fast-glob';
import { ITSRequiredWith } from 'ts-type';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

export interface IOptions
{
	cwd: string,
	targetPath: string,

	bin?: string,

	force?: boolean,

	yesDoIt?: boolean,

	stdio?: SpawnSyncOptions["stdio"],
}

/**
 * https://stackoverflow.com/a/11764065/4563339
 */
export function gitChangeRootDir(options: IOptions)
{
	const { bin = 'git', cwd, yesDoIt, force, stdio = 'inherit' } = options;

	if (!isGitRoot(cwd))
	{
		throw new RangeError(`cwd not a git root ${cwd}`)
	}

	if (!yesDoIt)
	{
		const msg = `options.yesDoIt must be true, this is unsafe action, make sure u backup all data`;

		throw new Error(msg)
	}

	let { targetPath } = options;

	let ls = FastGlob.sync([
		targetPath,
		'!**/.git',
	], {
		cwd,
		onlyFiles: false,
		onlyDirectories: true,
	});

	if (ls.length != 1)
	{
		throw new RangeError(`targetPath is not allow, [${ls}], length: ${ls.length}`)
	}

	return targetPath
		.split('/')
		.map((targetPath) =>
		{
			console.debug(`current: ${targetPath}`);

			return _core({
				bin,
				cwd,
				targetPath,
				force,
				stdio,
			})
		})
	;
}

export function _core(options: ITSRequiredWith<IOptions, 'targetPath' | 'cwd' | 'force' | 'stdio' | 'bin' >)
{
	const { bin = 'git', cwd, targetPath, force, stdio = 'inherit' } = options;

	if (typeof targetPath !== 'string' || targetPath === '')
	{
		throw new RangeError(`targetPath is not allow, '${targetPath}'`)
	}

	let cp = crossSpawnSync(bin, [
		'filter-branch',
		'--subdirectory-filter',
		targetPath,
		'--tag-name-filter',
		'cat',
		force ? '-f' : '',
		'--',
		'--all',
	], {
		cwd,
		stripAnsi: true,
		stdio,
	});

	let msg = crossSpawnOutput(cp.output);

	if (/Cannot create a new backup/i.test(msg))
	{
		throw new Error(msg)
	}
	else if (cp.error)
	{
		throw cp.error
	}

	return cp;
}

export default gitChangeRootDir
