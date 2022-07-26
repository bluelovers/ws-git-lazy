/**
 * Created by user on 2019/6/13.
 */

import { gitRoot, isGitRoot } from 'git-root2/core'

export { gitRoot, isGitRoot }

export function hasGit(cwd: string): string
{
	if (!cwd || typeof cwd !== 'string' || !gitRoot(cwd))
	{
		throw new TypeError(`'${cwd}' is not exists in git`);
	}

	return cwd
}

export default gitRoot
