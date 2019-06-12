/**
 * Created by user on 2019/6/13.
 */

import gitRoot from 'git-root2'
import path from 'path'
import fs from 'fs'

export { gitRoot }

export function hasGit(cwd: string): string
{
	if (!cwd || typeof cwd !== 'string' || !gitRoot(cwd))
	{
		throw new TypeError(`'${cwd}' is not exists in git`);
	}

	return cwd
}

export function isGitRoot(cwd: string, realpath?: boolean)
{
	let p1 = path.normalize(cwd);
	let p2 = path.normalize(gitRoot(cwd));

	if (realpath)
	{
		return (fs.realpathSync(p1) === fs.realpathSync(p2))
	}

	return (p1 === p2)
}

export default gitRoot
