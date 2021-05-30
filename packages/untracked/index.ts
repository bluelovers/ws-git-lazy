/**
 * Created by user on 2019/6/13.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { sortTree } from '@lazy-glob/sort-tree';
import { array_unique, lazy_unique } from 'array-hyper-unique';
import { handleSpawnOutputArray } from '@git-lazy/util/spawn/data';
import { hasGit } from '@git-lazy/root';
import path from 'path'

export interface IOptions
{
	bin?: string
}

export function gitUntrackedFile(git_root: string, options?: IOptions): string[]
{
	git_root = hasGit(git_root)

	const { bin = 'git' } = (options || {});

	let cp = crossSpawnSync(bin, 'ls-files --others --exclude-standard'.split(' '), {
		cwd: git_root,
		stripAnsi: true,
	});

	return handleSpawnOutputArray(cp.stdout.toString());
}

export function gitUntrackedDir(git_root: string, options?: IOptions): string[]
{
	return sortTree(array_unique(gitUntrackedFile(git_root, options)
		.map(v => path.dirname(v))))
}

export default gitUntrackedFile
