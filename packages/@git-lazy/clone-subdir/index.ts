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
import { localBranchExists } from '@git-lazy/branch/lib/branch-exists';
import { currentBranchName } from '@git-lazy/branch/lib/current-name';

export interface IOptionsGitCloneSubDir extends IOptionsGitClone
{
	subDir: string;
	targetDir: string,
}

export async function gitCloneSubDir(remote: string, options: IOptionsGitCloneSubDir)
{
	({ remote, options } = handleOptions(remote, options));

	await gitClone(remote, options);

	let branch = Date.now().toString();

	let cwd = options.targetDir;

	if (!isGitRoot(cwd))
	{
		throw new Error(`${options.targetDir} not a git root`)
	}

	await subtreeSplit({
		cwd,
		prefix: options.subDir,
		branch,
	})

	if (!localBranchExists(branch, cwd))
	{
		throw new Error(`branch '${branch}' not exists`)
	}

	await crossSpawnGitAsync('git', [
		'checkout',
		'-B',
		`master`,
		branch
	], {
		cwd,
		stdio: 'inherit',
	})

	if (branch !== currentBranchName(cwd))
	{
		throw new Error(`something wrong when switch branch {${branch} => master}`)
	}
}

export default gitCloneSubDir
