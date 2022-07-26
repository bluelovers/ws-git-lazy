
import { resolve } from 'upath2';
import { existsSync } from "fs";
import { crossSpawnGitSync } from '@git-lazy/spawn';
import { crossSpawnOutput } from '@lazy-spawn/stringify';
import { pathIsSame } from 'path-is-same';

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
	return pathIsSame(target, gitRoot(target))
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
