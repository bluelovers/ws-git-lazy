#!/usr/bin/env node

import gitRoot from '..';

const root = gitRoot();

if (root == null || root === '')
{
	console.error(`can't found git root`);
	process.exitCode = 1;
}
else
{
	console.log(root);
}
