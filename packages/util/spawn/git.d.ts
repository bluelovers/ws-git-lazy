/**
 * Created by user on 2019/3/10.
 */
export * from '@git-lazy/spawn/lib/types';
export * from '@git-lazy/spawn';
import { crossSpawnGitSync as crossSpawnSync, crossSpawnGitAsync as crossSpawnAsync } from '@git-lazy/spawn';
export { crossSpawnSync, crossSpawnAsync };
declare const _default: typeof import("./git");
export default _default;
