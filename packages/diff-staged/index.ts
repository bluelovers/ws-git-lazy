/**
 * Created by user on 2019/6/13.
 */

import { hasGit } from '@git-lazy/root';
import { crossSpawnGitSync as crossSpawnSync } from '@git-lazy/spawn';
import handleSpawnOutputArray from '@git-lazy/spawn/lib/data';

export interface IOptions
{
	bin?: string
}

export function gitDiffStaged(git_root: string, options?: IOptions): string[]
{
	git_root = hasGit(git_root);

	const { bin = 'git' } = (options || {});

	let cp = crossSpawnSync(bin, 'diff --cached --name-only'.split(' '), {
		cwd: git_root,
		stripAnsi: true,
	});

	return handleSpawnOutputArray(cp.stdout.toString());
}

export function gitDiffStagedDir(git_root: string, options?: IOptions): string[]
{
	git_root = hasGit(git_root);

	const { bin = 'git' } = (options || {});

	let cp = crossSpawnSync(bin,
		'diff --cached --dirstat=files,0'.split(' '),
		{
			cwd: git_root,
			stripAnsi: true,
		},
	);

	let cp2 = crossSpawnSync(bin,
		'diff --dirstat=files,0'.split(' '),
		{
			cwd: git_root,
			stripAnsi: true,
		},
	);

	return handleSpawnOutputArray([
		cp.stdout.toString(),
		cp2.stdout.toString(),
	].join('\n'), s =>
	{
		return s.replace(/^\s+\d+(\.\d+)%\s+/, '')
	});
}

export function gitDiffStagedFile(git_root: string, options?: IOptions): string[]
{
	git_root = hasGit(git_root);

	const { bin = 'git' } = (options || {});

	let cp = crossSpawnSync(bin,
		'diff --cached --name-only --relative'.split(' '),
		{
			cwd: git_root,
			stripAnsi: true,
		},
	);

	let cp2 = crossSpawnSync(bin,
		'diff --name-only --relative'.split(' '),
		{
			cwd: git_root,
			stripAnsi: true,
		},
	);

	return handleSpawnOutputArray([
		cp.stdout.toString(),
		cp2.stdout.toString(),
	].join('\n'));
}

export default gitDiffStagedFile
