/**
 * Created by user on 2020/6/15.
 */

import { crossSpawnGitAsync, crossSpawnGitSync } from '@git-lazy/spawn';
import { gitCloneCmd } from './lib/util';
export * from './lib/types';
import { IOptionsGitClone, IOptionsGitCloneSync } from './lib/types';

export function gitClone(remote: string, options?: IOptionsGitClone)
{
	options = options ?? {};

	const cwd = options.cwd ?? process.cwd();

	const args = gitCloneCmd(remote, options);

	return crossSpawnGitAsync('git', args, {
		stdio: 'inherit',
		...options.spawnOptions,
		cwd,
	})
}

export function gitCloneSync(remote: string, options?: IOptionsGitCloneSync)
{
	options = options ?? {};

	const cwd = options.cwd ?? process.cwd();

	const args = gitCloneCmd(remote, options);

	return crossSpawnGitSync('git', args, {
		stdio: 'inherit',
		...options.spawnOptions,
		cwd,
	})
}

export default gitClone
