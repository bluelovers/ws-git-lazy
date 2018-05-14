"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crossSpawn = require("cross-spawn");
const git_rev_range_1 = require("git-rev-range");
const path = require("upath2");
const crlf_normalize_1 = require("crlf-normalize");
const gitRoot = require("git-root");
exports.defaultOptions = {
    encoding: 'UTF-8',
};
/**
 * git diff-tree -r --no-commit-id --name-status --encoding=UTF-8  HEAD~1 HEAD
 */
function gitDiffFrom(from = 'HEAD', to = 'HEAD', options = {}) {
    options = Object.assign({}, exports.defaultOptions, options);
    let cwd = git_rev_range_1.getCwd(options.cwd);
    let root = gitRoot(cwd);
    if (!root) {
        throw new RangeError(`no exists git at ${cwd}`);
    }
    let opts2 = {
        cwd,
        realHash: true,
    };
    ({ from, to } = git_rev_range_1.revisionRangeData(from, to, opts2));
    let log = crossSpawn.sync('git', filterArgv([
        ...'diff-tree -r --no-commit-id --name-status'.split(' '),
        `--encoding=${options.encoding}`,
        git_rev_range_1.revisionRange(from, to, opts2),
    ]), {
        //stdio: 'inherit',
        cwd,
    });
    if (log.error || log.stderr.length) {
        throw new Error(log.stderr.toString());
    }
    let list = crlf_normalize_1.crlf(log.stdout.toString())
        .split(crlf_normalize_1.LF)
        .reduce(function (a, line) {
        line = line.replace(/^\s+/g, '');
        if (line) {
            let [status, file] = line.split(/\t/);
            let fullpath = path.join(root, file);
            file = path.relative(root, fullpath);
            let row = {
                status,
                path: file,
                fullpath,
            };
            a.push(row);
        }
        return a;
    }, []);
    cwd = path.resolve(cwd);
    root = path.resolve(root);
    return Object.assign(list, {
        from,
        to,
        cwd,
        root,
    });
}
exports.gitDiffFrom = gitDiffFrom;
function filterArgv(argv) {
    return argv.filter(function (v) {
        return v !== null && v !== '';
    });
}
exports.filterArgv = filterArgv;
exports.default = gitDiffFrom;
