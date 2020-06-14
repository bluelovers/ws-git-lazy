/**
 * Created by user on 2020/6/15.
 */

import { SpawnOptions } from '@git-lazy/spawn';
import { ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn/lib/types';

export interface IOptionsClone
{
	depth?: number,
	singleBranch?: boolean,
	noTags?: boolean,
}

export interface IOptionsGitClone
{
	cwd?: string,
	targetDir?: string,

	cloneOptions?: IOptionsClone,

	spawnOptions?: ISpawnGitAsyncOptions,
}

export interface IOptionsGitCloneSync
{
	cwd?: string,
	targetDir?: string,

	cloneOptions?: IOptionsClone,

	spawnOptions?: ISpawnGitSyncOptions,
}
