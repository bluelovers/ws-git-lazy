import { ITSAndStringLiteral } from 'ts-type/lib/helper/string';

export const enum EnumRebaseLineType
{
	COMMENT,
	COMMAND,
}

export const enum EnumRebaseCommands
{
	/**
	 * cherry-pick 這個 patch
	 */
	pick = 'pick',
	/**
	 * cherry-pick 這個 patch，並會在執行到這個步驟的時候，會停下來讓你修改提交訊息
	 */
	reword = 'reword',
	/**
	 * cherry-pick 這個 patch，並會在執行到這個步驟的時候，會停下來讓你修改提內容可以在這個時候 git add/rm 檔案
	 */
	edit = 'edit',
	/**
	 * cherry-pick 這個 patch，但是會和前一個 patch 合併在一起
	 */
	squash = 'squash',
	/**
	 * cherry-pick 這個 patch，會和前一個 patch 合併在一起，但是會捨棄這個 patch 的提交訊息
	 */
	fixup = 'fixup',
	/**
	 * cherry-pick 這個 patch，並且執行一個 shell script
	 */
	exec = 'exec',
}

export interface IRebaseCommandLine<CMD extends EnumRebaseCommands = EnumRebaseCommands>
{
	raw: string;
	cmd: CMD;
	hash: string;
	message: string;
	type: EnumRebaseLineType.COMMAND;
}

export interface IRebaseCommentLine
{
	type: EnumRebaseLineType.COMMENT;
	raw: string;
}

export type IRebaseLine = IRebaseCommandLine | IRebaseCommentLine;

export function toRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): EnumRebaseCommands
{
	// @ts-ignore
	return EnumRebaseCommands[cmd]
}
