/**
 * Created by user on 2018/5/16/016.
 */

import path = require('upath2');
import * as crossSpawn from 'cross-spawn';

function gitRoot(cwd?: string): string
{
	let p = (crossSpawn.sync('git', [
		'rev-parse',
		'--show-toplevel',
	], {
		cwd,
	}).stdout || '').toString().replace(/^[\n\r]+|[\n\r]+$/g, '');

	if (p)
	{
		return path.resolve(p);
	}

	return null;
}

namespace gitRoot
{
	export function isGitRoot(target: string)
	{
		let root = gitRoot(target);

		return (root && path.resolve(root) === path.resolve(target));
	}

	export async function async(cwd?: string)
	{
		return gitRoot(cwd);
	}
}

export = gitRoot as typeof gitRoot & {
	gitRoot(cwd?: string): ReturnType<typeof gitRoot>,
	default(cwd?: string): ReturnType<typeof gitRoot>,
	async(cwd?: string): Promise<ReturnType<typeof gitRoot>>,
}

// @ts-ignore
gitRoot.default = gitRoot.gitRoot = gitRoot;
