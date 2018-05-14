/**
 * Created by user on 2018/5/14/014.
 */

import * as crossSpawn from 'cross-spawn';
import { resolveRevision, revisionRange, getCwd } from 'git-rev-range';
import * as path from 'path';
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
export function gitDiffFrom(from: string | number = 'HEAD', to: string = 'HEAD', options: IOptions = {})
{
	let cwd = getCwd(options.cwd);
	let root = gitRoot(cwd);

	if (!root)
	{
		throw new RangeError(`no exists git at ${cwd}`);
	}

	let log = crossSpawn.sync('git', filterArgv([
		...'diff-tree -r --no-commit-id --name-status'.split(' '),
		`--encoding=${options.encoding}`,
		revisionRange(from, to, {
			cwd,
			realHash: true,
		}),
	]), {
		//stdio: 'inherit',
		cwd,
	});

	if (log.error || log.stderr.length)
	{

	}
	else
	{
		return crlf(log.stdout.toString())
			.split(LF)
			.reduce(function (a, line)
			{
				line = line.replace(/^\s+/g, '');

				if (line)
				{
					let [status, file] = line.split(/\t/);

					let fullpath = path.posix.join(root, file);
					file = path.posix.relative(root, fullpath);

					let row = {
						status,
						path: file,
						fullpath,
					};

					a.push(row)
				}

				return a;
			}, [] as {
				status: string,
				path: string,
				fullpath: string,
			}[])
		;
	}
}

export function filterArgv(argv: string[])
{
	return argv.filter(function (v)
	{
		return v !== null && v !== ''
	});
}

export default gitDiffFrom;
