/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { debug, notEmptyString } from '@git-lazy/util';
import { isGitRoot } from 'git-root2';
import { crossSpawnOutput } from '@git-lazy/util/spawn/util';

export function currentBranchName(REPO_PATH: string)
{
	let cp = crossSpawnSync('git', [
		'rev-parse',
		'--abbrev-ref',
		'HEAD',
	], {
		cwd: REPO_PATH,
	});

	cp = checkGitOutput(cp);

	if (!cp.error)
	{
		let name = crossSpawnOutput(cp.stdout);

		if (notEmptyString(name) && !/\s/.test(name))
		{
			return name;
		}
	}

	debug.enabled && debug(crossSpawnOutput(cp.output));
}

export default currentBranchName
