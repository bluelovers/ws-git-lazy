import { kebabCase } from 'lodash';
import unparse from 'yargs-unparser';

export function kebabCaseObject<T extends Record<string, any>>(data: Record<string, any>): T
{
	return Object.entries(data)
		.reduce((a, [k, v]) => {
			// @ts-ignore
			a[kebabCase(k)] = v
			return a
		}, {} as T)
}

export function lazyUnParse(data: Record<string, any>, options?: {
	noKebabCase?: boolean,
}): string[]
{
	if (!options?.noKebabCase)
	{
		data = kebabCaseObject(data);
	}

	return unparse(data)
}

export default lazyUnParse
