/**
 * Created by user on 2019/3/10.
 */

import { crossSpawnSync, crossSpawnAsync, SpawnOptions, checkGitOutput } from '@git-lazy/util/spawn/git';
import { notEmptyString, debug } from '@git-lazy/util';
import { isGitRoot } from 'git-root2/core';
import { crossSpawnOutput, filterCrossSpawnArgv } from '@git-lazy/util/spawn/util';
import fs from 'fs';
import localBranchList from './branch-list';

export function localBranchExists(name: string, REPO_PATH: string)
{
	return localBranchList(REPO_PATH).includes(name)
}

export default localBranchExists
