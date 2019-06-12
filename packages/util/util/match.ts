/**
 * Created by user on 2019/6/13.
 */

import micromatch = require('micromatch');

export function matchGlob(list: string[], pattern: string[]): string[]
{
	return micromatch(list, pattern)
}

export default matchGlob
