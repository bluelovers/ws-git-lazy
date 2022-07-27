import { crossSpawnGitAsync, crossSpawnGitSync, ISpawnGitAsyncOptions } from '@git-lazy/spawn';
import { filterCrossSpawnArgv } from '@git-lazy/spawn/lib/util';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
import { handleSpawnOutputArray } from '@git-lazy/spawn/lib/data';

export const enum EnumSort
{
	committerdate = 'committerdate',
	taggerdate = 'taggerdate',
	creatordate = 'creatordate',
	refname = 'refname',
}

export interface IOptions
{
	cwd?: string,

	sort?: string | ITSTypeAndStringLiteral<EnumSort>,

	/**
	 * when set `null` will return all tags
	 *
	 * @default 'HEAD~20'
	 */
	target?: string | 'master' | 'main' | 'HEAD' | 'HEAD~20' | null,

	merged?: string | 'master' | 'main' | 'HEAD',
}

export function buildCmd(options?: IOptions): string[]
{
	options ??= {};

	const args = [
		'tag',
		/**
		 * 不加上格式的話會變成依照 TAG 名稱來排序
		 */
		'--format',
		`;%(${EnumSort.taggerdate}:iso-strict)%09%09%(${EnumSort.creatordate}:iso-strict)%09%09%(${EnumSort.refname}:strip=2)`,
	];

	let target = options.target;

	if (typeof target === 'undefined')
	{
		target = 'HEAD~20';
	}

	if (target)
	{
		args.push('--contains');
		args.push(target);
	}

	if (options.merged)
	{
		args.push('--merged');
		args.push(options.merged);
	}

	args.push('--sort');
	args.push(options.sort || EnumSort.taggerdate);

	return filterCrossSpawnArgv(args)
}

/**
 * @see https://gist.github.com/rponte/fdc0724dd984088606b0
 */
export function gitTagList(options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions)
{
	let cwd = options?.cwd ?? spawnOptions?.cwd ?? process.cwd();

	const args = buildCmd(options);

	return crossSpawnGitAsync("git", args, {
		...spawnOptions,
		cwd,
	})
		.then(cp =>
		{
			return handleSpawnOutputArray(cp.stdout.toString())
		})
		.then(_handleResult)
		;
}

export function gitTagListSync(options?: IOptions, spawnOptions?: ISpawnGitAsyncOptions)
{
	let cwd = options?.cwd ?? spawnOptions?.cwd ?? process.cwd();

	const args = buildCmd(options);

	const cp = crossSpawnGitSync("git", args, {
		...spawnOptions,
		cwd,
	});

	return _handleResult(handleSpawnOutputArray(cp.stdout.toString()))
}

export function _handleResult(list: string[]): [string, Date][]
{
	return list.map(v =>
	{
		let data = v
			.replace(/^;/, '')
			.split('\t\t')
		;
		let date = new Date(data[0] || data[1]);

		return [data[2], date]
	})
		.reverse()
		// @ts-ignore
		.sort((a, b) => (b[1] - a[1])) as any
}

export default gitTagList
