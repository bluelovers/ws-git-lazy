/**
 * Created by user on 2018/5/14/014.
 */

import * as path from "path";
import gitDiffFrom from '../index';

let from = '96d60cdc0';

let r = gitDiffFrom(from, 'origin/master', {
	cwd: path.resolve('D:/Users/Documents/The Project/nodejs-yarn/ws-novel/packages/node-novel-travis-test/dist_novel'),

});

console.log(r);
