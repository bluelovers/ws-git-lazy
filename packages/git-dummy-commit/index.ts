'use strict';

import { crossSpawnGitSync } from '@git-lazy/spawn';

const defaultMsg = 'Test commit';

export { defaultMsg }

function makeDefault(str: string, options?: IOptionsGitDummyCommit)
{
	return !str
		?.replace(/^\s+|\s+$/g, '')
		?.length
		? (options?.defaultMsg ?? defaultMsg)
		: str
		;
}

export interface IOptionsGitDummyCommit
{
	cwd?: string,
	defaultMsg?: string,
	silent?: boolean,
	msg?: string | string[],
}

export function gitDummyCommit(msg?: string | string[] | IOptionsGitDummyCommit, options?: IOptionsGitDummyCommit)
{
	let args: string[] = [];

	if (typeof msg === 'object' && !Array.isArray(msg))
	{
		options = msg;
		msg = options.msg;
	}

	if (Array.isArray(msg))
	{
		if (msg.length > 0)
		{
			args = msg
				.map(m => makeDefault(m, options))
				.reduce((messages, m) => {
					messages.push('-m')
					messages.push(m)
					return messages
				}, args)
			;
		}
		else
		{
			args = ['-m', defaultMsg];
		}
	}
	else
	{
		args = ['-m', makeDefault(msg, options)];
	}

	const cwd = options?.cwd ?? process.cwd();

	return crossSpawnGitSync('git', [
		'commit',
		...args,
		'--allow-empty',
		'--no-gpg-sign'
	], {
		cwd,
		stdio: options?.silent === false ? 'inherit' : void 0
	});
}

export default gitDummyCommit;
