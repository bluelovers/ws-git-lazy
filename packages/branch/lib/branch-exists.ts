/**
 * Created by user on 2019/3/10.
 */

import { localBranchList } from './branch-list';

export function _localBranchExistsCore(name: string, list: string[])
{
	return list.find((current) => {
		return current === name || (current === `refs/heads/${name}` && !name.startsWith('refs/heads/'))
	})
}

export function _localBranchExists(name: string, REPO_PATH: string)
{
	const list = localBranchList(REPO_PATH);

	return _localBranchExistsCore(name, list)
}

export function localBranchExists(name: string, REPO_PATH: string)
{
	return _localBranchExists(name, REPO_PATH)?.length > 0
}

export default localBranchExists
