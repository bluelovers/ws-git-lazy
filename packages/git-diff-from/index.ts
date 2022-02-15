/**
 * Created by user on 2018/5/14/014.
 */

import { resolveRevision, revisionRange, getCwd, revisionRangeData, IOptions as IGitRevRangeOptions } from 'git-rev-range';
import { join, relative, resolve } from 'upath2';
import { crlf, chkcrlf, LF, CRLF, CR } from 'crlf-normalize';
import { gitRoot } from 'git-root2/core';
import { decode, decode2 } from 'git-decode';
import { crossSpawnGitSync } from '@git-lazy/spawn';

export interface IOptions
{
	encoding?: string,
	cwd?: string,
}

export const defaultOptions: IOptions = {
	encoding: 'UTF-8',
};

export interface IGitDiffFromRow
{
	status: string,
	path: string,
	fullpath: string,
}

export type IGitDiffFrom = Array<IGitDiffFromRow> & {
	from: string,
	to: string,
	cwd: string,
	root: string,
	files: string[],
}

/**
 * git diff-tree -r --no-commit-id --name-status --encoding=UTF-8  HEAD~1 HEAD
 */
// @ts-ignore
export function gitDiffFrom(from: string | number, options?: IOptions): IGitDiffFrom
export function gitDiffFrom(from: string | number, to: string, options?: IOptions): IGitDiffFrom
export function gitDiffFrom(from: string | number = 'HEAD', to: string | any = 'HEAD', options: IOptions = {})
{
	if (typeof to === 'object' && to !== null)
	{
		[options, to] = [to, 'HEAD'];
	}

	options = Object.assign({}, defaultOptions, options);

	let cwd = getCwd(options.cwd);
	let root = gitRoot(cwd) as string;

	if (!root)
	{
		throw new RangeError(`no exists git at ${cwd}`);
	}

	let opts2: IGitRevRangeOptions = {
		cwd,
		realHash: true,
		gitlogOptions: {
			firstParent: true,
			displayFilesChangedDuringMerge: true,
		},
	};

	({ from, to } = revisionRangeData(from, to, opts2));

	let files: string[] = [];
	let list: {
		status: string,
		path: string,
		fullpath: string,
	}[] = [];

	if (from != to)
	{
		let log = crossSpawnGitSync('git', filterArgv([
			...'diff-tree -r --no-commit-id --name-status'.split(' '),
			`--encoding=${options.encoding}`,
			revisionRange(from, to, opts2),
		]), {
			//stdio: 'inherit',
			cwd,
			stripAnsi: true,
		});

		if (log.error || log.stderr.length)
		{
			throw new Error(log.stderr.toString())
		}

		list = crlf(log.stdout.toString())
			.split(LF)
			.reduce(function (a, line)
			{
				line = line.replace(/^\s+/g, '');

				if (line)
				{
					let [status, file] = line.split(/\t/);

					/**
					 * 沒有正確回傳 utf-8 而是變成編碼化
					 */
					file = decode2(file);

					let fullpath = join(root, file);
					file = relative(root, fullpath);

					let row = {
						status,
						path: file,
						fullpath,
					};

					files.push(file);

					a.push(row)
				}

				return a;
			}, [])
		;
	}

	cwd = resolve(cwd);
	root = resolve(root);

	return Object.assign(list, {
		from,
		to,
		cwd,
		root,
		files,
	});
}

export function filterArgv(argv: string[])
{
	return argv.filter(function (v)
	{
		return v !== null && v !== ''
	});
}

export default gitDiffFrom;
