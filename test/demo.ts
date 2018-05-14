/**
 * Created by user on 2018/5/14/014.
 */

import * as path from "path";
import gitDiffFrom from '../index';

let r = gitDiffFrom(5, null, {
	cwd: path.resolve('../../../test/demo/git1/sub'),
});

console.log(r);
