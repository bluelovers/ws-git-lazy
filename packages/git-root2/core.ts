import { crossSpawnOutput } from '@git-lazy/spawn/lib/util';
import { resolve } from 'upath2';
import { existsSync } from "fs";
import { crossSpawnGitSync } from '@git-lazy/spawn';

export function gitRoot(cwd?: string): string
{
	let p = crossSpawnOutput((crossSpawnGitSync('git', [
			'rev-parse',
			'--show-toplevel',
		], {
			cwd,
			stripAnsi: true,
		}).stdout || '') as any, {
			stripAnsi: true,
			clearEol: true,
		}).replace(/^[\n\r]+|[\n\r]+$/g, '')
	;

	if (p)
	{
		p = resolve(p);

		if (existsSync(p))
		{
			return p;
		}
	}

	return null;
}

export function isGitRoot(target: string)
{
	let root = gitRoot(target);

	return (root && resolve(root) === resolve(target));
}

export function sync(cwd?: string)
{
	return gitRoot(cwd);
}

// lazy fake async
export async function async(cwd?: string)
{
	return gitRoot(cwd);
}

gitRoot.isGitRoot = isGitRoot;
gitRoot.sync = sync;
gitRoot.async = async;
gitRoot.default = gitRoot;

export default gitRoot
