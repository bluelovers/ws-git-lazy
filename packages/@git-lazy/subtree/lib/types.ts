/**
 * Created by user on 2020/6/5.
 */

import { ITSRequireAtLeastOne, ITSRequiredWith } from 'ts-type';

export interface IOptionsCore
{

	prefix: string,

	cwd?: string,
	branch?: string,

	squash?: boolean,
}

export interface IOptionsCoreWithHandlers<O extends IOptions = IOptionsCommon>
{
	handlers?: IOptionsCoreHandlers<O>,
}

export interface IOptionsCoreHandlers<O extends IOptions = IOptionsCommon>
{
	handlePrefixPath?(options: IOptionsHandlePrefixPath): IReturnTypeHandlePrefixPath;

	assertValue?(optionsRuntime: IOptionsRuntime<O> | any): asserts optionsRuntime is IOptionsRuntime<O>;

	handleValue?(options: O): O;
}

export interface IOptionsCorePlus
{
	remote?: string,
	name?: string,
}

type IOptionsCommonCore = IOptionsCore & ITSRequireAtLeastOne<IOptionsCorePlus>

export type IOptionsCommon = IOptionsCommonCore & IOptionsCoreWithHandlers;

interface IOptionsSplitCore extends Omit<ITSRequiredWith<IOptionsCore, 'branch'> & IOptionsCorePlus, 'handlers'>
{
	rejoin?: boolean,
	ignoreJoins?: boolean,
}

export interface IOptionsSplit extends IOptionsSplitCore, IOptionsCoreWithHandlers<IOptionsSplitCore>
{

}

export type IOptions = IOptionsCommon | IOptionsSplit;

export interface IOptionsRuntime<O extends IOptionsCore = IOptionsCommon> extends IReturnTypeHandlePrefixPath
{
	options: O;

	remote: string;
	branch: string;
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

	split = 'split',
}

export interface IOptionsHandlePrefixPath
{
	prefix: string,
	prefixType: EnumPrefixType,
	root: string,
	cwd: string,
}

export interface IReturnTypeHandlePrefixPath extends IOptionsHandlePrefixPath
{
	prefixPath: string,
}
