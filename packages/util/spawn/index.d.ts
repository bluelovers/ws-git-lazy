/**
 * Created by user on 2019/3/10.
 */
import { sync as crossSpawnSync, async as crossSpawnAsync } from 'cross-spawn-extra';
export * from './types';
export { crossSpawnSync, crossSpawnAsync };
export { crossSpawnSync as sync };
export { crossSpawnAsync as async };
declare const _default: typeof import(".");
export default _default;
