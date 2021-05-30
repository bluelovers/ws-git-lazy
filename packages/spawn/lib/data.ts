/**
 * Created by user on 2019/6/13.
 */

import { sortTree } from '@lazy-glob/sort-tree';
import { array_unique } from 'array-hyper-unique';

export { sortTree }

export function handleSpawnOutputArray(output: string, trimFn?: (text: string) => string): string[]
{
	trimFn = trimFn || (s => s);

	return sortTree(array_unique(output
		.split(/[\n\r]+/)
		.map(s => trimFn(s).trim())
		.filter(_filterEmpty)))
		;
}

export function _filterEmpty(v: string): boolean
{
	return v !== void 0 && v !== null && v !== ''
}

export default handleSpawnOutputArray
