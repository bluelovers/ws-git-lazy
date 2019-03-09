/**
 * Created by user on 2019/3/10.
 */

import { console, enableDebug, disableDebug, debug, debugConsole } from './log'
export { console, enableDebug, disableDebug, debug, debugConsole }

export function notEmptyString(s: string)
{
	return typeof s === 'string' && s.trim() !== ''
}

export default exports as typeof import('./index');
