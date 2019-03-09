/**
 * Created by user on 2019/3/10.
 */

import CrossSpawn = require('cross-spawn-extra');
import { sync as crossSpawnSync, async as crossSpawnAsync } from 'cross-spawn-extra';

export * from './types'

export { crossSpawnSync, crossSpawnAsync }

export default exports as typeof import('./index');
