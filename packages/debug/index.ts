/**
 * Created by user on 2020/5/27.
 */

import { Console } from 'debug-color2';
import _debug from 'debug';

export function createConsole(...argv)
{
	const console = new Console(...argv);

	console.enabledColor = true;

	console.inspectOptions = console.inspectOptions || {};
	console.inspectOptions.colors = true;

	return console
}

export const console = createConsole();

export const debug = _debug('@git-lazy');
export const debugConsole = createConsole(null, {
	label: true,
	time: true,
});

let _log = debugConsole.grey;

debug.log = _log.bind(_log);

debugConsole.enabled = debug.enabled;

export function enableDebug()
{
	debug.enabled = true;
	debugConsole.enabled = true;
}

export function disableDebug()
{
	debug.enabled = false;
	debugConsole.enabled = false;
}

export default console
