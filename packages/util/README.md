# @git-lazy/util

    @git-lazy core lib and a better cross spawn for git

```
npm install @git-lazy/util
```

```ts
import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { notEmptyString, debug } from '@git-lazy/util';
import { crossSpawnOutput, filterCrossSpawnArgv } from '@git-lazy/util/spawn/util';

export function localBranchList(REPO_PATH: string): string[]
{
	let cp = crossSpawnSync('git', [
		'branch',
		'--list',
		'--format=%(refname)',
	], {
		cwd: REPO_PATH,
	});

	cp = checkGitOutput(cp);

	if (!cp.error)
	{
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
```
