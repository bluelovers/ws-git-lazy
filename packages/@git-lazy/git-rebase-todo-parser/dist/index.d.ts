import { ITSAndStringLiteral } from 'ts-type/lib/helper/string';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export declare const enum EnumRebaseLineType {
	COMMENT = 0,
	COMMAND = 1
}
export declare const enum EnumRebaseCommands {
	/**
	 * cherry-pick 這個 patch
	 */
	pick = "pick",
	/**
	 * cherry-pick 這個 patch，並會在執行到這個步驟的時候，會停下來讓你修改提交訊息
	 */
	reword = "reword",
	/**
	 * cherry-pick 這個 patch，並會在執行到這個步驟的時候，會停下來讓你修改提內容可以在這個時候 git add/rm 檔案
	 */
	edit = "edit",
	/**
	 * cherry-pick 這個 patch，但是會和前一個 patch 合併在一起
	 */
	squash = "squash",
	/**
	 * cherry-pick 這個 patch，會和前一個 patch 合併在一起，但是會捨棄這個 patch 的提交訊息
	 */
	fixup = "fixup",
	/**
	 * cherry-pick 這個 patch，並且執行一個 shell script
	 */
	exec = "exec"
}
export interface IRebaseCommandLine<CMD extends EnumRebaseCommands = EnumRebaseCommands> {
	raw: string;
	cmd: CMD;
	hash: string;
	message: string;
	type: EnumRebaseLineType.COMMAND;
}
export interface IRebaseCommentLine {
	type: EnumRebaseLineType.COMMENT;
	raw: string;
}
export declare type IRebaseLine = IRebaseCommandLine | IRebaseCommentLine;
export declare function toRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): EnumRebaseCommands;
export declare const re: RegExp;
export declare function isRebaseCommentLineString(line: string): boolean;
export declare function isRebaseCommentLine(line: IRebaseLine): line is IRebaseCommentLine;
export declare function isRebaseCommandLine(line: IRebaseLine): line is IRebaseCommandLine;
export declare function filterRebaseListByType(lines: IRebaseLine[], type: ITSAndStringLiteral<EnumRebaseLineType.COMMAND>): IRebaseCommandLine[];
export declare function filterRebaseListByType(lines: IRebaseLine[], type: ITSAndStringLiteral<EnumRebaseLineType.COMMENT>): IRebaseCommentLine[];
export declare function filterRebaseListByType(lines: IRebaseLine[], type: ITSAndStringLiteral<EnumRebaseLineType>): IRebaseCommandLine[] | IRebaseCommentLine[];
export declare function validRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): cmd is EnumRebaseCommands;
export declare function assertRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): asserts cmd is EnumRebaseCommands;
export declare function parseRebaseCommandLine(raw: string): {
	raw: string;
	cmd: EnumRebaseCommands;
	hash: string;
	message: string;
};
export declare function parseRebaseLine(raw: string): IRebaseCommentLine | IRebaseCommandLine<EnumRebaseCommands>;
export declare function generatorParseRebaseTodoFromBuffer(context: string | Uint8Array): Generator<IRebaseCommentLine | IRebaseCommandLine<EnumRebaseCommands>, void, unknown>;
export declare function generatorParseRebaseTodoFromIterable(iterator: Iterable<Uint8Array> | Iterable<string>): Generator<IRebaseCommentLine | IRebaseCommandLine<EnumRebaseCommands>, void, unknown>;
export declare function generatorParseRebaseTodoFromArray(lines: string[] | Uint8Array[]): Generator<IRebaseCommentLine | IRebaseCommandLine<EnumRebaseCommands>, void, unknown>;
export declare function parseRebaseTodo(context: ITSValueOrArray<string> | ITSValueOrArray<Uint8Array>): (IRebaseCommentLine | IRebaseCommandLine<EnumRebaseCommands>)[];
export default parseRebaseTodo;

export {};
