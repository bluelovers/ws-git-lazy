/**
 * Created by user on 2020/5/27.
 */
import { ISpawnASyncError, SpawnASyncReturns } from 'cross-spawn-extra';
export { stripAnsiValue as stripAnsi } from '@lazy-spawn/strip-ansi';
export declare function getCrossSpawnError<T extends SpawnASyncReturns>(cp: T | any): ISpawnASyncError<T>;
export declare function filterCrossSpawnArgv<T extends unknown>(args: T[], fn?: (value: T) => boolean): T[];
