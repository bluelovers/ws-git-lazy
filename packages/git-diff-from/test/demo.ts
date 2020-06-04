/**
 * Created by user on 2018/5/14/014.
 */

import path from "path";
import gitlog from 'gitlog2';
import gitDiffFrom from '../index';

let from = '12006118';

let r = gitDiffFrom(from, 'origin/master', {
	cwd: path.resolve('D:\\Users\\Documents\\The Project\\nodejs-test\\node-novel2\\dist_novel'),

});

console.log(r);

//console.log(gitlog({
//	cwd: path.resolve('D:/Users/Documents/The Project/nodejs-yarn/ws-novel/packages/node-novel-travis-test/dist_novel'),
//	//number: 1,
//	branch: '5a534bbde..origin/master',
//}));
