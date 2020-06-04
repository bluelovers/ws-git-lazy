#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const root = __1.default();
if (!(root === null || root === void 0 ? void 0 : root.length)) {
    console.error(`can't found git root`);
    process.exit(1);
}
else {
    console.log(root);
}
//# sourceMappingURL=git-root.js.map