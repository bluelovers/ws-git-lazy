#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
let argv = process.argv.slice(2);
if (argv.length) {
    (0, __1.gitDummyCommit)(argv);
}
else {
    [
        'Usage',
        '  $ git-dummy-commit [msg] [msg] ...',
        '',
        'Examples',
        '  $ git-dummy-commit "unicorns & rainbows"',
    ].forEach(m => console.log(m));
    process.exit(1);
}
//# sourceMappingURL=cli.js.map