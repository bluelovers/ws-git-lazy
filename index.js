"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crossSpawn = require("cross-spawn");
const git_rev_range_1 = require("git-rev-range");
const path = require("upath2");
const crlf_normalize_1 = require("crlf-normalize");
const gitRoot = require("git-root2");
const git_decode_1 = require("git-decode");
exports.defaultOptions = {
    encoding: 'UTF-8',
};
function gitDiffFrom(from = 'HEAD', to = 'HEAD', options = {}) {
    if (typeof to === 'object' && to !== null) {
        [options, to] = [to, 'HEAD'];
    }
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
    let files = [];
    let list = [];
    if (from != to) {
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
        list = crlf_normalize_1.crlf(log.stdout.toString())
            .split(crlf_normalize_1.LF)
            .reduce(function (a, line) {
            line = line.replace(/^\s+/g, '');
            if (line) {
                let [status, file] = line.split(/\t/);
                /**
                 * @FIXME 沒有正確回傳 utf-8 而是變成編碼化
                 */
                if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/)) {
                    file = file.replace(/^"|"$/g, '');
                    file = git_decode_1.decode(file);
                }
                let fullpath = path.join(root, file);
                file = path.relative(root, fullpath);
                let row = {
                    status,
                    path: file,
                    fullpath,
                };
                files.push(file);
                a.push(row);
            }
            return a;
        }, []);
    }
    cwd = path.resolve(cwd);
    root = path.resolve(root);
    return Object.assign(list, {
        from,
        to,
        cwd,
        root,
        files,
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
