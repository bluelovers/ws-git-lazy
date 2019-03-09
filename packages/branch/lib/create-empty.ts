/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { notEmptyString, debug } from '@git-lazy/util';
import { isGitRoot } from 'git-root2';
import { crossSpawnOutput, filterCrossSpawnArgv } from '@git-lazy/util/spawn/util';
import currentBranchName from './current-name';
import fs = require('fs');

const defaultMessage = 'create empty branch by git-lazy';

export function createEmptyBranch(old_name: string, new_name: string, options?: createEmptyBranch.IOptions)
{
	if ((options = _createEmptyBranch(old_name, new_name, options)))
	{
		let { cwd, msg, author } = options;

		if (!isGitRoot(cwd))
		{
			throw new Error(`fatal: target path not a git root "${cwd}"`)
		}

		let opts: SpawnOptions = {
			cwd,
		};

		let current_name = currentBranchName(cwd);

		if (notEmptyString(current_name))
		{
			throw new Error(`fatal: can't get current branch name`);
		}

		let cp = checkGitOutput(crossSpawnSync('git', [
			'checkout',
			'--no-track',
			'--orphan',
			new_name,
		], opts), true);

		let current_new = currentBranchName(cwd);

		if (current_new !== new_name)
		{
			throw new Error(`fatal: can't create new branch "${new_name}", current is "${current_new}"`);
		}

		debug.enabled && debug(crossSpawnOutput(cp.output));

		let mode_argv: unknown[];

		switch (options.mode)
		{
			case createEmptyBranch.EnumMode.ORPHAN_RM:
				mode_argv = [
					'rm',
					'-r',
					'.',
				];
				break;
			default:
				mode_argv = [
					'reset',
				];
				break;
		}

		debug.enabled && debug(mode_argv);

		cp = checkGitOutput(crossSpawnSync('git', mode_argv, opts), true);

		debug.enabled && debug(crossSpawnOutput(cp.output));

		if (!msg || !notEmptyString(msg = String(msg)))
		{
			msg = defaultMessage
		}

		cp = checkGitOutput(crossSpawnSync('git', filterCrossSpawnArgv([
			'commit',
			notEmptyString(author) ? `--author=${author}` : null,
			'--allow-empty',
			'-m',
			msg,
		]), opts), true);

		debug.enabled && debug(crossSpawnOutput(cp.output));

		return cwd;
	}
}

export declare namespace createEmptyBranch
{
	export interface IOptions
	{
		cwd?: string,
		mode?: EnumMode,
		msg?: string,
		author?: string,
	}

	export enum EnumMode
	{
		ORPHAN = 0,
		ORPHAN_RM = 1,
	}
}

export default createEmptyBranch

function _createEmptyBranch(old_name: string, new_name: string, options: createEmptyBranch.IOptions)
{
	if (notEmptyString(old_name) && notEmptyString(new_name) && old_name !== new_name)
	{
		options = options || {};

		let { cwd = process.cwd() } = options;

		if (notEmptyString(cwd) && (cwd = fs.realpathSync(cwd)))
		{
			options.cwd = cwd;

			return options;
		}
	}
}
