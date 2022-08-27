/**
 * Created by user on 2019/3/10.
 */

import { checkGitOutput, crossSpawnSync, SpawnOptions } from '@git-lazy/util/spawn/git';
import { debug, notEmptyString } from '@git-lazy/util';
import { isGitRoot } from 'git-root2/core';
import { filterCrossSpawnArgv } from '@git-lazy/util/spawn/util';
import { currentBranchName } from './current-name';
import { localBranchExists } from './branch-exists';
import { getCWD } from '@git-lazy/util/util/index';
import fs from 'fs';
import { gitlog } from 'gitlog2';
import { crossSpawnOutput } from '@lazy-spawn/stringify';

const defaultMessage = 'create empty branch by git-lazy';

/**
 * 建立空白分支
 */
export function createEmptyBranch(new_name: string, options?: createEmptyBranch.IOptions)
{
	if ((options = _createEmptyBranch(new_name, options)))
	{
		let { cwd, msg, author } = options;

		if (!isGitRoot(cwd))
		{
			throw new Error(`fatal: target path not a git root "${cwd}"`)
		}

		let opts: SpawnOptions = {
			cwd,
			stripAnsi: true,
		};

		let current_name = currentBranchName(cwd);

		if (!notEmptyString(current_name))
		{
			throw new Error(`fatal: can't get current branch name`);
		}

		if (localBranchExists(new_name, cwd))
		{
			throw new Error(`fatal: target branch "${new_name}" already exists`);
		}

		let cp = checkGitOutput(crossSpawnSync('git', [
			'checkout',
			'--orphan',
			new_name,
		], opts), true);

		let current_new = currentBranchName(cwd);

		if (current_new === new_name)
		{
			throw new Error(`fatal: branch "${new_name}" already exists, delete it or change a new name`);
		}

		if (current_new != null)
		{
			throw new Error(`fatal: something wrong, expect new branch is undefined, but got "${current_new}"`);
		}

		debug.enabled && debug(crossSpawnOutput(cp.output));

		let mode_argv: unknown[];

		switch (options.mode)
		{
			case createEmptyBranch.EnumMode.ORPHAN_RM_FORCE:
				mode_argv = [
					'rm',
					'-rf',
					'.',
				];
				break;
			case createEmptyBranch.EnumMode.ORPHAN_RM:
				mode_argv = [
					'rm',
					'-r',
					'.',
				];
				break;
			case createEmptyBranch.EnumMode.ORPHAN:
			default:
				mode_argv = [
					'reset',
				];
				break;
		}

		debug.enabled && debug(options.mode, mode_argv);

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

		let current_new2 = currentBranchName(cwd);

		if (current_new2 !== new_name)
		{
			throw new Error(`fatal: current branch "${current_new2}" should same as "${new_name}"`);
		}

		let _logs = gitlog.sync({
			cwd,
		});

		debug.enabled && debug(_logs);

		if (_logs.length !== 1)
		{
			throw new Error(`fatal: expect log length = 1, but got ${_logs.length}`);
		}

		let _log = _logs[0];

		if (_log.subject !== msg)
		{
			throw new Error(`fatal: commit log not subject not equal, current is:\n${_log.subject}`);
		}

		if (_log.files.length)
		{
			throw new Error(`fatal: expect log files length = 0, but got ${_log.files.length}`);
		}

		return cwd;
	}
}

export declare namespace createEmptyBranch
{
	export interface IOptions
	{
		/**
		 * 要建立空白分支的 git repo 路徑，只允許根目錄
		 */
		cwd?: string,
		/**
		 * 清理檔案的模式
		 */
		mode?: EnumMode,
		/**
		 * 設定 commit 的 訊息
		 */
		msg?: string,
		/**
		 * 設定 commit 的 author
		 */
		author?: string,
	}

	export const enum EnumMode
	{
		/**
		 * 預設模式 比較快 不移除檔案 只操作 GIT 紀錄
		 */
		ORPHAN = 0,
		/**
		 * 會移除檔案
		 */
		ORPHAN_RM = 1,
		/**
		 * 會強制移除檔案
		 */
		ORPHAN_RM_FORCE = 2,
	}
}

export default createEmptyBranch

function _createEmptyBranch(new_name: string, options: createEmptyBranch.IOptions)
{
	if (notEmptyString(new_name))
	{
		options = options || {};

		let cwd = getCWD(options.cwd, getCWD.EnumRealPath.FS);

		if (notEmptyString(cwd))
		{
			options.cwd = cwd;

			return options;
		}
	}
}
