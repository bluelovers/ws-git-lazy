/**
 * Created by user on 2019/3/10.
 */

import Bluebird from 'bluebird';
import CrossSpawn from 'cross-spawn-extra';
import { sync as crossSpawnSync, async as crossSpawnAsync } from 'cross-spawn-extra';

export * from './types'

export { crossSpawnSync, crossSpawnAsync }

export { crossSpawnSync as sync };
export { crossSpawnAsync as async };

export default exports as typeof import('./index');
