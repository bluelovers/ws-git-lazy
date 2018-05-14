# git-diff-from

```ts
import * as path from "path";
import gitDiffFrom from 'git-diff-from';

let r = gitDiffFrom(5, null, {
	cwd: path.resolve('../../../test/demo/git1/sub'),
});

console.log(r);
```

```ts
[ { status: 'D',
    path: '2.txt',
    fullpath: 'D:/Users/Documents/The Project/nodejs-yarn/ws-git/test/demo/git1/2.txt' },
  { status: 'M',
    path: '3.txt',
    fullpath: 'D:/Users/Documents/The Project/nodejs-yarn/ws-git/test/demo/git1/3.txt' },
  { status: 'A',
    path: 'sub/sub.txt',
    fullpath: 'D:/Users/Documents/The Project/nodejs-yarn/ws-git/test/demo/git1/sub/sub.txt' },
  { status: 'A',
    path: 'カリギュラ.txt',
    fullpath: 'D:/Users/Documents/The Project/nodejs-yarn/ws-git/test/demo/git1/カリギュラ.txt' },
  { status: 'A',
    path: '卡利古拉.txt',
    fullpath: 'D:/Users/Documents/The Project/nodejs-yarn/ws-git/test/demo/git1/卡利古拉.txt' } ]
```
