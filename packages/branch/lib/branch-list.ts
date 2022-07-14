/**
 * Created by user on 2019/3/10.
 */

import {
	crossSpawnSync,
	crossSpawnAsync,
	SpawnOptions,
	checkGitOutput,
} from '@git-lazy/util/spawn/git';
import { notEmptyString, debug } from '@git-lazy/util';
import { isGitRoot } from 'git-root2/core';
import fs from 'fs';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

export function localBranchList(REPO_PATH: string): string[]
{
	let cp = crossSpawnSync('git', [
		'branch',
		'--list',
		'--format=%(refname)',
	], {
		cwd: REPO_PATH,
	});

	if (!cp.error)
	{
		// @ts-ignore
		let out = crossSpawnOutput(cp.stdout, {
			clearEol: true,
			stripAnsi: true,
		});

		let ls = out.split(/\n/).map(function (s)
		{
			return s.trim();
		});

		if (ls.length)
		{
			return ls
		}
	}

	debug.enabled && debug(crossSpawnOutput(cp.output));

	return [];
}

export default localBranchList
