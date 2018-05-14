# git-rev-range

[index.d.ts](index.d.ts)

## demo

```ts
import * as path from 'path';
import { resolveRevision, revisionRange } from 'git-rev-range';

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
```

```ts
{ from: 'HEAD~3', to: 'HEAD', fromName: 'HEAD~3', toName: 'HEAD' }
HEAD~3..HEAD
{ from: '8bd0750',
  to: 'a9c9302',
  fromName: 'HEAD~3',
  toName: 'HEAD' }
8bd0750..a9c9302
{ from: '8bd07503d77f13c13dac408ce30ab46aa0ef8021',
  to: 'a9c93026130d18c12adfe547436c934ab685ff71',
  fromName: 'HEAD~3',
  toName: 'HEAD' }
8bd07503d77f13c13dac408ce30ab46aa0ef8021..a9c93026130d18c12adfe547436c934ab685ff71
```
