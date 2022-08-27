#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const root = (0, core_1.gitRoot)();
if (!(root === null || root === void 0 ? void 0 : root.length)) {
    console.error(`can't found git root`);
    process.exit(1);
}
else {
    console.log(root);
}
//# sourceMappingURL=git-root.js.map