import { ITSAndStringLiteral } from 'ts-type/lib/helper/string';
import { EnumRebaseCommands, toRebaseCommand } from './types';

export function validRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): cmd is EnumRebaseCommands
{
	return toRebaseCommand(cmd)?.length > 0
}

export function assertRebaseCommand(cmd: ITSAndStringLiteral<EnumRebaseCommands>): asserts cmd is EnumRebaseCommands
{
	if (!validRebaseCommand(cmd))
	{
		throw new RangeError(`${cmd} is not valid rebase command`)
	}
}
