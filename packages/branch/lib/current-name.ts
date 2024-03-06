/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync } from '@git-lazy/util/spawn/git';
import { debug, notEmptyString } from '@git-lazy/util';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

/**
 * 取得目前分支名稱
 */
export function currentBranchName(REPO_PATH: string)
{
	let cp = crossSpawnSync('git', [
		'rev-parse',
		'--abbrev-ref',
		'HEAD',
	], {
		cwd: REPO_PATH,
		throwError: false,
	});

	if (!cp.error)
	{
		// @ts-ignore
		let name = crossSpawnOutput(cp.stdout, {
			clearEol: true,
			stripAnsi: true,
		});

		if (notEmptyString(name) && !/\s/.test(name))
		{
			return name;
		}
	}

	debug.enabled && debug(crossSpawnOutput(cp.output));
}

export default currentBranchName
