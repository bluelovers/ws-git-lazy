/**
 * Created by user on 2018/5/14/014.
 */

import * as path from "path";
import gitDiffFrom from '../index';

let r = gitDiffFrom(10, null, {
	cwd: path.resolve('D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel'),
});

console.log(r);
