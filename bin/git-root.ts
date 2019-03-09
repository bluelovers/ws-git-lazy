#!/usr/bin/env node

import gitRoot from '..';

let root = gitRoot();

if (root == null)
{
	console.error(root);
}
else
{
	console.log(root);
}
