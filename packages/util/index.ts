/**
 * Created by user on 2019/3/10.
 */

import Bluebird from 'bluebird';

import { console, debug, debugConsole, disableDebug, enableDebug } from './log';

export { console, enableDebug, disableDebug, debug, debugConsole }

export { notEmptyString, getCWD } from './util';

export default exports as typeof import('./index');
