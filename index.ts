/**
 * Created by user on 2018/5/14/014.
 */

import * as crossSpawn from 'cross-spawn';
import { resolveRevision, revisionRange, getCwd, revisionRangeData } from 'git-rev-range';
import * as path from 'upath2';
import { crlf, chkcrlf, LF, CRLF, CR } from 'crlf-normalize';
import * as gitRoot from 'git-root';

export interface IOptions
{
	encoding?: string,
	cwd?: string,
}

export const defaultOptions: IOptions = {
	encoding: 'UTF-8',
};

/**
 * git diff-tree -r --no-commit-id --name-status --encoding=UTF-8  HEAD~1 HEAD
 */
export function gitDiffFrom(from: string | number, options?: IOptions): ReturnType<typeof gitDiffFrom>
export function gitDiffFrom(from: string | number, to: string, options?: IOptions): ReturnType<typeof gitDiffFrom>
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

	let opts2 = {
		cwd,
		realHash: true,
	};

	({ from, to } = revisionRangeData(from, to, opts2));

	let log = crossSpawn.sync('git', filterArgv([
		...'diff-tree -r --no-commit-id --name-status'.split(' '),
		`--encoding=${options.encoding}`,
		revisionRange(from, to, opts2),
	]), {
		//stdio: 'inherit',
		cwd,
	});

	if (log.error || log.stderr.length)
	{
		throw new Error(log.stderr.toString())
	}

	let files: string[] = [];

	let list = crlf(log.stdout.toString())
		.split(LF)
		.reduce(function (a, line)
		{
			line = line.replace(/^\s+/g, '');

			if (line)
			{
				let [status, file] = line.split(/\t/);

				let fullpath = path.join(root, file);
				file = path.relative(root, fullpath);

				let row = {
					status,
					path: file,
					fullpath,
				};

				files.push(file);

				a.push(row)
			}

			return a;
		}, [] as {
			status: string,
			path: string,
			fullpath: string,
		}[])
	;

	cwd = path.resolve(cwd);
	root = path.resolve(root);

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
