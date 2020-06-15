/**
 * Created by user on 2020/6/15.
 */

import { crossSpawnGitSync, crossSpawnGitAsync, ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';

export interface IOptions
{
	cwd?: string,
	message?: string,
	forceGitTag?: boolean,
	signGitTag?: boolean,
}

export function buildCmd(tag: string, options?: IOptions): string[]
{
	const args = [
		"tag",
		tag,
		"-m",
		options?.message ?? tag,
	];

	if (options?.forceGitTag) {
		args.push("--force");
	}

	if (options?.signGitTag) {
		args.push("--sign");
	}

	return args
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
