/**
 * Created by user on 2020/6/15.
 */

import { crossSpawnGitSync, crossSpawnGitAsync, ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';
import { filterCrossSpawnArgv } from '@git-lazy/spawn/lib/util';

export interface IOptions
{
	cwd?: string,
	message?: string,
	forceGitTag?: boolean,
	signGitTag?: boolean,
	/**
	 * @see https://gitbook.tw/chapters/tag/using-tag
	 * @see https://git-tutorial.readthedocs.io/zh/latest/tagging.html
	 */
	annotated?: boolean,

	target?: string,
}

export function buildCmd(tag: string, options?: IOptions): string[]
{
	options ??= {};

	const args = [
		"tag",
		options.annotated && '-a',
		tag,
	];

	if (options.message?.length)
	{
		args.push('-m');
		args.push(options.message);
	}

	if (options.forceGitTag) {
		args.push("--force");
	}

	if (options.signGitTag) {
		args.push("--sign");
	}

	if (options.target)
	{
		args.push(options.target);
	}

	return filterCrossSpawnArgv(args)
}

export function gitTag(tag: string, options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions)
{
	let cwd = options?.cwd ?? spawnOptions?.cwd ?? process.cwd();

	const args = buildCmd(tag, options);

	return crossSpawnGitAsync("git", args, {
		...spawnOptions,
		cwd,
	});
}

export function gitTagSync(tag: string, options?: IOptions, spawnOptions?: ISpawnGitSyncOptions)
{
	let cwd = options?.cwd ?? spawnOptions?.cwd ?? process.cwd();

	const args = buildCmd(tag, options);

	return crossSpawnGitSync("git", args, {
		...spawnOptions,
		cwd,
	});
}

export default gitTag
