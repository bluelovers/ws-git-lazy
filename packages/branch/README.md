# @git-lazy/branch

    @git-lazy/branch

```
npm install @git-lazy/branch
```

[index.d.ts](index.d.ts)

```ts
import { createEmptyBranch } from '@git-lazy/branch';
import { enableDebug } from '@git-lazy/util';

enableDebug();

console.log(createEmptyBranch('new_xxxxxx', {
	cwd: 'C:\\Home\\Temp\\test-no-git-lfs',
}));
```
