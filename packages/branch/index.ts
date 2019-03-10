/**
 * Created by user on 2019/3/10.
 */
import createEmptyBranch from './lib/create-empty';
import currentBranchName from './lib/current-name';
import localBranchExists from './lib/branch-exists';
import localBranchList from './lib/branch-list';

export {
	createEmptyBranch,
	currentBranchName,
	localBranchExists,
	localBranchList,
}

export default exports as typeof import('./index');
