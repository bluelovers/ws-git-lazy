/**
 * Created by user on 2018/5/14/014.
 */

import * as path from "path";
import gitDiffFrom from '../index';

let r = gitDiffFrom('a9c9302', 'e1cfc6d', {
	cwd: path.resolve('../../../test/demo/git1/sub'),
});

console.log(r);
