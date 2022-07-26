import { getGitEnv } from '@git-lazy/git-env-var';
import { findUpPaths, findUpPathsAsync } from 'find-up-paths';

const DEFAULT_GIT_DIR = '.git';

export interface IOptionsFindGitDir
{
	cwd?: string,
	env?: Record<string, string>,
	throwIfNoEntry?: boolean,
}

export function findGitDir(options?: IOptionsFindGitDir)
{
	options ??= {};

	const GIT_DIR = getGitEnv('GIT_DIR', options.env) ?? DEFAULT_GIT_DIR;

	return findUpPaths(GIT_DIR, {
		cwd: options.cwd,
		onlyDirectories: true,
		throwIfNoEntry: options.throwIfNoEntry,
	}).result
}

export function findGitDirAsync(options?: IOptionsFindGitDir)
{
	options ??= {};

	const GIT_DIR = getGitEnv('GIT_DIR', options.env) ?? DEFAULT_GIT_DIR;

	return findUpPathsAsync(GIT_DIR, {
		cwd: options.cwd,
		onlyDirectories: true,
		throwIfNoEntry: options.throwIfNoEntry,
	}).then(data => data.result)
}

export default findGitDir
