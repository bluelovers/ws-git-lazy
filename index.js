"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crossSpawn = require("cross-spawn");
const git_rev_range_1 = require("git-rev-range");
const path = require("path");
const crlf_normalize_1 = require("crlf-normalize");
const gitRoot = require("git-root");
exports.defaultOptions = {
    encoding: 'UTF-8',
};
function gitDiffFrom(from = 'HEAD', to = 'HEAD', options = {}) {
    let cwd = git_rev_range_1.getCwd(options.cwd);
    let root = gitRoot(cwd);
    if (!root) {
        throw new RangeError(`no exists git at ${cwd}`);
    }
    let log = crossSpawn.sync('git', filterArgv([
        ...'diff-tree -r --no-commit-id --name-status'.split(' '),
        `--encoding=${options.encoding}`,
        git_rev_range_1.revisionRange(from, to, {
            cwd,
            realHash: true,
        }),
    ]), {
        cwd,
    });
    if (log.error || log.stderr.length) {
    }
    else {
        return crlf_normalize_1.crlf(log.stdout.toString())
            .split(crlf_normalize_1.LF)
            .reduce(function (a, line) {
            line = line.replace(/^\s+/g, '');
            if (line) {
                let [status, file] = line.split(/\t/);
                let fullpath = path.posix.join(root, file);
                file = path.posix.relative(root, fullpath);
                let row = {
                    status,
                    path: file,
                    fullpath,
                };
                a.push(row);
            }
            return a;
        }, []);
    }
}
exports.gitDiffFrom = gitDiffFrom;
function filterArgv(argv) {
    return argv.filter(function (v) {
        return v !== null && v !== '';
    });
}
exports.filterArgv = filterArgv;
exports.default = gitDiffFrom;
