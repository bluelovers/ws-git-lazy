/**
 * Created by user on 2020/6/5.
 */

import { ITSRequireAtLeastOne } from 'ts-type';

export type IOptions = {

	prefix: string,

	cwd?: string,
	branch?: string,

	squash?: boolean,

} & ITSRequireAtLeastOne<{
	remote: string,
	name?: string,
}>

export interface IOptionsRuntime
{
	options: IOptions;

	cwd: string;
	root: string;

	remote: string;
	branch: string;

	prefixType: EnumPrefixType;
	prefix: string;
	prefixPath: string;
}

export enum EnumPrefixType
{
	ROOT,
	RELATIVE,
	ABSOLUTE,
}

export enum EnumSubtreeCmd
{
	add = 'add',
	push = 'push',
	pull = 'pull',
}
