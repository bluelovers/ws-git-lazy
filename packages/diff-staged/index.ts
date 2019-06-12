/**
 * Created by user on 2019/6/13.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { sortTree } from 'node-novel-globby/lib/glob-sort';
import { array_unique, lazy_unique } from 'array-hyper-unique';

export interface IOptions
{
	bin?: string
}

export function gitDiffStaged(git_root: string, options?: IOptions): string[]
{
	git_root = validGitRoot(git_root);

	const { bin = 'git' } = (options || {});

	let cp = crossSpawnSync(bin, 'diff --cached --name-only'.split(' '), {
		cwd: git_root,
		stripAnsi: true,
	});

	return _handle(cp.stdout.toString());
}

export function gitDiffStagedDir(git_root: string, options?: IOptions): string[]
{
	git_root = validGitRoot(git_root);

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

	return _handle([
		cp.stdout.toString(),
		cp2.stdout.toString(),
	].join('\n'), s =>
	{
		return s.replace(/^\s+\d+(\.\d+)%\s+/, '')
	});
}

export function gitDiffStagedFile(git_root: string, options?: IOptions): string[]
{
	git_root = validGitRoot(git_root);

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

	return _handle([
		cp.stdout.toString(),
		cp2.stdout.toString(),
	].join('\n'));
}

function _handle(output: string, trimFn?: (text: string) => string): string[]
{
	trimFn = trimFn || (s => s);

	return sortTree(array_unique(output
		.split(/[\n\r]+/)
		.map(s => trimFn(s).trim())
		.filter(_filterEmpty)))
		;
}

function _filterEmpty(v: string): boolean
{
	return v != null && v !== ''
}

function validGitRoot(git_root: string)
{
	if (!git_root)
	{
		throw new TypeError(`'${git_root}' is not a valid git root`);
	}

	return git_root
}

export default gitDiffStagedFile
