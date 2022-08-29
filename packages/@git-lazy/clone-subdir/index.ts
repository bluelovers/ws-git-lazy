/**
 * Created by user on 2020/6/15.
 */

import { gitClone, IOptionsGitClone } from '@git-lazy/clone';
import { subtreeSplit } from '@git-lazy/subtree';
import { handleOptions } from '@git-lazy/clone/lib/util';
import { console, debugConsole, debug, enableDebug } from '@git-lazy/debug';
import { crossSpawnGitAsync } from '@git-lazy/spawn';
import lazyUnParse from '@git-lazy/util-args';
import { isGitRoot } from '@git-lazy/root';
import { _localBranchExists, localBranchExists } from '@git-lazy/branch/lib/branch-exists';
import { currentBranchName } from '@git-lazy/branch/lib/current-name';
import { deepStrictEqual } from 'assert';

export interface IOptionsGitCloneSubDir extends IOptionsGitClone
{
	/**
	 * sub path for subtree
	 */
	subDir: string;

	/**
	 * new git dir
	 */
	targetDir: string,

	/**
	 * default branch when clone
	 */
	defaultSourceBranch?: string,

	/**
	 * new branch name when done
	 */
	newBranch?: string,
}

export async function gitCloneSubDir(remote: string, options: IOptionsGitCloneSubDir)
{
	({ remote, options } = handleOptions(remote, options));

	console.info(`clone remote:`, remote);

	await gitClone(remote, options);

	let cwd = options.targetDir;

	if (!isGitRoot(cwd))
	{
		throw new Error(`${options.targetDir} not a git root`)
	}

	const _defaultBranch = currentBranchName(cwd);

	const defaultBranch = options.defaultSourceBranch ?? _defaultBranch;

	if (_defaultBranch !== defaultBranch)
	{
		await crossSpawnGitAsync('git', [
			'checkout',
			'-B',
			defaultBranch
		], {
			cwd,
			stdio: 'inherit',
		});

		_assertCurrentBranchName(defaultBranch, cwd);
	}

	console.info(`defaultBranch:`, defaultBranch);

	let branch = 'temp/' + Date.now().toString();

	await subtreeSplit({
		cwd,
		prefix: options.subDir,
		branch,
	});

	let branch2 = _localBranchExists(branch, cwd);

	if (!branch2?.length)
	{
		throw new Error(`branch '${branch}' not exists, current branch is ${currentBranchName(cwd)}`)
	}

	const _tempBranch = `${branch}-master`;

	await crossSpawnGitAsync('git', [
		'checkout',
		'-B',
		_tempBranch,
		branch2
	], {
		cwd,
		stdio: 'inherit',
	});

	const branch3 = currentBranchName(cwd);

	if (_tempBranch !== branch3)
	{
		throw new Error(`something wrong when checkout branch ${_tempBranch}, current branch is ${branch3}`)
	}

	const newBranch = options.newBranch ?? defaultBranch;

	await crossSpawnGitAsync('git', [
		'checkout',
		'-B',
		newBranch,
		_tempBranch,
	], {
		cwd,
		stdio: 'inherit',
	})

	_assertCurrentBranchName(newBranch, cwd);
}

function _assertCurrentBranchName(name: string, cwd: string, message?: string)
{
	const _branch = currentBranchName(cwd);

	deepStrictEqual(_branch, name, message);
}

export default gitCloneSubDir
