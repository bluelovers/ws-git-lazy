/**
 * Created by user on 2018/5/16/016.
 */

import path = require('upath2');
import fs = require('fs');
import crossSpawn = require('cross-spawn');

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
		p = path.resolve(p);

		if (fs.existsSync(p))
		{
			return p;
		}
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

	export function sync(cwd?: string)
	{
		return gitRoot(cwd);
	}

	export async function async(cwd?: string)
	{
		return gitRoot(cwd);
	}
}

gitRoot.default = gitRoot;

export = gitRoot
