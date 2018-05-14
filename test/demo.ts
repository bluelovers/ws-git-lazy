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

a = resolveRevision(5, null, {
	cwd,
	realHash: true,
	fullHash: true,
});

console.log(a);
console.log(revisionRange(a.from, a.to, cwd));

a = resolveRevision('a9c93026130d18c12adfe547436c934ab685ff71', 'e1cfc6d163a81ad98fbd9a8684020dbaba7fdd33', {
	cwd,
	realHash: true,
});

console.log(a);
console.log(revisionRange(a.from, a.to, cwd));

