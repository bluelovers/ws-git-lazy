/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync } from '@git-lazy/util/spawn/git';
import { debug, notEmptyString } from '@git-lazy/util';
import { getCWD } from '@git-lazy/util/util/index';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

export function deleteBranch(REPO_PATH: string, name: string, force?: boolean)
{
	let cp = crossSpawnSync('git', [
		'branch',
		force === true ? '-D' : '-d',
		name,
	], {
		cwd: getCWD(REPO_PATH, getCWD.EnumRealPath.FS),
	});

	debug.enabled && debug(crossSpawnOutput(cp.output));

	if (!cp.error)
	{
		return true;
	}
}

export default deleteBranch
