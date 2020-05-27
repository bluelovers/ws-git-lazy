/**
 * Created by user on 2019/3/10.
 */

import CrossSpawn = require('cross-spawn-extra');
import Bluebird = require('bluebird');
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, CrossSpawnExtra } from 'cross-spawn-extra/core';
import { crossSpawnOutput, stripAnsi } from './util';
import { console, debugConsole } from '../log';

export * from '@git-lazy/spawn/lib/types';
export * from '@git-lazy/spawn';

import { crossSpawnGitSync as crossSpawnSync, crossSpawnGitAsync as crossSpawnAsync } from '@git-lazy/spawn';

export { crossSpawnSync, crossSpawnAsync }

export default exports as typeof import('./git');
