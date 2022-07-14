/**
 * Created by user on 2019/3/10.
 */

/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { notEmptyString, debug } from '@git-lazy/util';
import fs from 'fs';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

export function renameRemoteBranch(remote: string, old_name: string, new_name: string, options?: renameRemoteBranch.IOptions)
{
	if (options = _check_before(remote, old_name, new_name, options))
	{
		let { cwd } = options;

		let cp = crossSpawnSync('git', [
			'push',
			remote,
			`${remote}/${old_name}:${new_name}`,
			`:${old_name}`,
		], {
			cwd,
		});

		if (!cp.error)
		{
			console.log(crossSpawnOutput(cp.output));

			return true;
		}

		debug.enabled && debug(crossSpawnOutput(cp.output));
	}
}

export declare namespace renameRemoteBranch
{

	export interface IOptions
	{
		/**
		 * 要建立空白分支的 git repo 路徑，只允許根目錄
		 */
		cwd?: string,
	}

}

export default renameRemoteBranch

function _check_before(remote: string, old_name: string, new_name: string, options?: renameRemoteBranch.IOptions)
{
	if (notEmptyString(remote) && notEmptyString(old_name) && notEmptyString(new_name) && old_name !== new_name)
	{
		options = options || {};

		let { cwd = process.cwd() } = options;

		if (notEmptyString(cwd) && (cwd = fs.realpathSync(cwd)))
		{
			options.cwd = cwd;

			return options;
		}
	}
}
