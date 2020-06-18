#!/usr/bin/env node
'use strict';
const gitDummyCommit = require('..');
let argv = process.argv.slice(2);
if (argv.length) {
    gitDummyCommit(argv);
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