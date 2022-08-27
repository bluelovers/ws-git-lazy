#!/usr/bin/env node

import { gitRoot } from '../core';

const root = gitRoot();

if (!root?.length)
{
	console.error(`can't found git root`);
	process.exit(1);
}
else
{
	console.log(root);
}
