/**
 * Created by user on 2019/3/10.
 */

import { Console } from 'debug-color2';
import _debug = require('debug');

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
export const debugConsole = createConsole();

debug.log = debugConsole.grey;

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
