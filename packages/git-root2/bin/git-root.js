#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = (0, tslib_1.__importDefault)(require(".."));
const root = (0, __1.default)();
if (!(root === null || root === void 0 ? void 0 : root.length)) {
    console.error(`can't found git root`);
    process.exit(1);
}
else {
    console.log(root);
}
//# sourceMappingURL=git-root.js.map