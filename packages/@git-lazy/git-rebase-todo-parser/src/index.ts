import { LineByLine } from '@lazy-node/readlines/class';
import { EnumRebaseCommands, EnumRebaseLineType, IRebaseCommandLine, IRebaseCommentLine } from './types';
import { isRebaseCommentLineString, re } from './filter';
import { assertRebaseCommand } from './assert';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export * from './types';
export * from './filter';
export * from './assert';

export function parseRebaseCommandLine(raw: string)
{
	const m = re.exec(raw);

	const [, cmd, hash, message] = m;

	assertRebaseCommand(cmd);

	return {
		raw,
		cmd: cmd as EnumRebaseCommands,
		hash,
		message,
	}
}

export function parseRebaseLine(raw: string)
{
	if (isRebaseCommentLineString(raw))
	{
		return <IRebaseCommentLine>{
			type: EnumRebaseLineType.COMMENT as const,
			raw,
		}
	}

	return <IRebaseCommandLine>{
		type: EnumRebaseLineType.COMMAND as const,
		...parseRebaseCommandLine(raw),
	}
}

export function generatorParseRebaseTodoFromBuffer(context: string | Uint8Array)
{
	const liner = new LineByLine(context as Buffer);

	return generatorParseRebaseTodoFromIterable(liner.generator())
}

export function* generatorParseRebaseTodoFromIterable(iterator: Iterable<Uint8Array> | Iterable<string>)
{
	for (let line of
		iterator)
	{
		yield parseRebaseLine(line.toString())
	}
}

export function generatorParseRebaseTodoFromArray(lines: string[] | Uint8Array[])
{
	if (!Array.isArray(lines))
	{
		throw new TypeError(`lines must be an array`)
	}

	return generatorParseRebaseTodoFromIterable(lines)
}

export function parseRebaseTodo(context: ITSValueOrArray<string> | ITSValueOrArray<Uint8Array>)
{
	return [
		...(Array.isArray(context)
			? generatorParseRebaseTodoFromArray
			: generatorParseRebaseTodoFromBuffer)(context as any),
	]
}

export default parseRebaseTodo
