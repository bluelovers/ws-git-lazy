/**
 * Created by user on 2019/6/4.
 */

import { resolveConfigPath, sync as parseGitConfig, expandKeys } from 'parse-git-config';
import { gitRoot } from 'git-root2/core';
import { globSearch, globSearchSync, async, sync } from 'glob-search';

export function findConfigPathLocal(cwd?: string)
{
	let root = gitRoot(cwd || process.cwd());

	return globSearchSync([
		".git/config",
	], {
		cwd: root,
		absolute: true,
		onlyFiles: true,
		stopPath: root,
	}).value[0]
}

export function parseConfig(file: string): {
	core?: {
		repositoryformatversion?: number,

		filemode?: boolean,
		bare?: boolean,
		logallrefupdates?: boolean,
		symlinks?: boolean,
		ignorecase?: boolean,

		[k: string]: unknown
	},
	remote?: Record<string | 'origin', {
		url?: string,
		fetch?: string
		[k: string]: unknown
	}>
	branch?: Record<string | 'master', {
		remote?: 'origin' | string,
		merge?: string,
		[k: string]: unknown
	}>
}
{
	let o = parseGitConfig({
		path: file,
	});

	return expandKeys(o)
}

export function filterRemoteUrl(o: ReturnType<typeof parseConfig>): string
{
	let ret: string;

	if (o.branch && o.branch['master'] && o.branch['master'].remote)
	{
		ret = _(o.branch['master'].remote)
	}

	if (!ret)
	{
		ret = _('origin')
	}

	if (!ret)
	{
		let ls = Object.keys(o.remote);

		for (let row of ls)
		{
			ret = _(row)

			if (ret)
			{
				break;
			}
		}
	}

	return ret

	function _(name: string): string
	{
		if (o.remote && o.remote[name] && o.remote[name].url)
		{
			return o.remote[name].url
		}
	}
}

export default findConfigPathLocal
