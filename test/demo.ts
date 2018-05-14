/**
 * Created by user on 2018/5/14/014.
 */

import * as path from 'path';
import { resolveRevision, revisionRange } from '../index';

let cwd = path.resolve('../../../test/demo/git1');

let a: ReturnType<typeof resolveRevision>;

a = resolveRevision(5, null, {
	cwd,
});

console.log(a);
console.log(revisionRange(a.from, a.to, cwd));

a = resolveRevision(5, null, {
	cwd,
	realHash: true,
});

console.log(a);
console.log(revisionRange(a.from, a.to, cwd));

a = resolveRevision(5, null, {
	cwd,
	realHash: true,
	fullHash: true,
});

console.log(a);
console.log(revisionRange(a.from, a.to, cwd));
