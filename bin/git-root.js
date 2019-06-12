#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var __1 = require("..");
var root = __1["default"]();
if (root == null || root === '') {
    console.error("can't found git root");
    process.exitCode = 1;
}
else {
    console.log(root);
}
