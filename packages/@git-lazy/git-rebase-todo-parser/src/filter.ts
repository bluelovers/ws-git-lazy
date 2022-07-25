import { EnumRebaseLineType, IRebaseCommandLine, IRebaseCommentLine, IRebaseLine } from './types';
import { ITSAndStringLiteral } from 'ts-type/lib/helper/string';

export const re = /^(\w+)\s(\w+)\s(.*)$/;

export function isRebaseCommentLineString(line: string)
{
	return /^(?:\s*)(?:#.*)?$/.test(line)
}

export function isRebaseCommentLine(line: IRebaseLine): line is IRebaseCommentLine
{
	return line.type === EnumRebaseLineType.COMMENT
}

export function isRebaseCommandLine(line: IRebaseLine): line is IRebaseCommandLine
{
	return line.type === EnumRebaseLineType.COMMAND
}

export function filterRebaseListByType(lines: IRebaseLine[],
	type: ITSAndStringLiteral<EnumRebaseLineType.COMMAND>,
): IRebaseCommandLine[]
export function filterRebaseListByType(lines: IRebaseLine[],
	type: ITSAndStringLiteral<EnumRebaseLineType.COMMENT>,
): IRebaseCommentLine[]
export function filterRebaseListByType(lines: IRebaseLine[],
	type: ITSAndStringLiteral<EnumRebaseLineType>,
): IRebaseCommandLine[] | IRebaseCommentLine[]
export function filterRebaseListByType(lines: IRebaseLine[], type: ITSAndStringLiteral<EnumRebaseLineType>)
{
	// @ts-ignore
	return lines.filter(line => line.type === type)
}
