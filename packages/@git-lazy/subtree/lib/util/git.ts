/**
 * Created by user on 2020/6/6.
 */

import { resolve, normalize } from 'upath2';
import gitRoot from 'git-root2';

export function handleGitPath(options: {
	cwd?: string,
})
{
	let cwd = resolve(options.cwd ?? process.cwd());
	let root = normalize(gitRoot(cwd));

	return {
		cwd,
		root,
	}
}
