"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const extend = require("lodash.assign");
const debug_1 = require("debug");
const array_hyper_unique_1 = require("array-hyper-unique");
const git_decode_1 = require("git-decode");
const sortObjectKeys = require("sort-object-keys2");
const debug = debug_1.default('gitlog'), delimiter = '\t', notOptFields = ['status', 'files'];
const fields = {
    hash: '%H',
    abbrevHash: '%h',
    treeHash: '%T',
    abbrevTreeHash: '%t',
    parentHashes: '%P',
    abbrevParentHashes: '%P',
    authorName: '%an',
    authorEmail: '%ae',
    authorDate: '%ai',
    authorDateRel: '%ar',
    committerName: '%cn',
    committerEmail: '%ce',
    committerDate: '%cd',
    committerDateRel: '%cr',
    subject: '%s',
    body: '%b',
    rawBody: '%B',
    tags: '%D'
};
// @ts-ignore
//Object.defineProperty(exports, "__esModule", { value: true });
function gitlog(options, cb) {
    // lazy name
    const REPO = typeof options.repo != 'undefined' ? options.repo : options.cwd;
    if (!REPO)
        throw new Error(`Repo required!, but got "${REPO}"`);
    if (!fs_1.existsSync(REPO))
        throw new Error(`Repo location does not exist: "${REPO}"`);
    let defaultExecOptions = { cwd: REPO };
    // Set defaults
    options = extend({}, exports.defaultOptions, { execOptions: defaultExecOptions }, options);
    options.execOptions = extend(options.execOptions, defaultExecOptions);
    if (options.returnAllFields) {
        options.fields = [].concat(Object.keys(fields));
        if (options.nameStatus && typeof options.nameStatusFiles == 'undefined') {
            options.nameStatusFiles = true;
        }
    }
    let C = ' ';
    // Start constructing command
    let command = 'git log ' + C;
    if (options.findCopiesHarder) {
        command += '--find-copies-harder ' + C;
    }
    if (options.all) {
        command += '--all ' + C;
    }
    if (options.number > 0) {
        command += '-n ' + options.number + C;
    }
    if (options.noMerges) {
        command += '--no-merges' + C;
    }
    if (options.firstParent) {
        command += '--first-parent' + C;
    }
    command = addOptional(command, options);
    // Start of custom format
    command += ' --pretty="@begin@';
    // Iterating through the fields and adding them to the custom format
    options.fields.forEach(function (field) {
        if (!fields[field] && notOptFields.indexOf(field) === -1)
            throw new Error('Unknown field: ' + field);
        command += delimiter + fields[field];
    });
    // Close custom format
    command += '@end@"';
    // Append branch (revision range) if specified
    if (options.branch) {
        command += ' ' + options.branch;
    }
    if (options.file) {
        command += ' -- ' + options.file;
    }
    //File and file status
    command += fileNameAndStatus(options);
    debug('command', options.execOptions, command);
    if (!cb) {
        // run Sync
        let stdout = child_process_1.execSync(command, options.execOptions).toString(), commits = stdout.split('@begin@');
        if (commits[0] === '') {
            commits.shift();
        }
        debug('commits', commits);
        commits = parseCommits(commits, options);
        return commits;
    }
    child_process_1.exec(command, options.execOptions, function (err, stdout, stderr) {
        debug('stdout', stdout);
        let commits = stdout.split('@begin@');
        if (commits[0] === '') {
            commits.shift();
        }
        debug('commits', commits);
        commits = parseCommits(commits, options);
        cb(stderr || err, commits);
    });
}
exports.gitlog = gitlog;
function fileNameAndStatus(options) {
    return options.nameStatus ? ' --name-status' : '';
}
function parseCommits(commits, options) {
    let { fields, nameStatus } = options;
    return commits.map(function (_commit) {
        let parts = _commit.split('@end@');
        let commit = parts[0].split(delimiter);
        let nameStatusFiles = [];
        if (parts[1]) {
            let parseNameStatus = parts[1].trimLeft().split('\n');
            // Removes last empty char if exists
            if (parseNameStatus[parseNameStatus.length - 1] === '') {
                parseNameStatus.pop();
            }
            parseNameStatus = parseNameStatus
                // Split each line into it's own delimitered array
                .map(function (d, i) {
                return d.split(delimiter);
            })
                // 0 will always be status, last will be the filename as it is in the commit,
                // anything inbetween could be the old name if renamed or copied
                .reduce(function (a, b) {
                let tempArr = [b[0], b[b.length - 1]];
                tempArr[1] = _decode(tempArr[1]);
                // @ts-ignore
                nameStatusFiles.push(tempArr);
                // If any files in between loop through them
                for (let i = 1, len = b.length - 1; i < len; i++) {
                    // If status R then add the old filename as a deleted file + status
                    // Other potentials are C for copied but this wouldn't require the original deleting
                    if (b[0].slice(0, 1) === 'R') {
                        tempArr.push('D', b[i]);
                        // @ts-ignore
                        nameStatusFiles.push(['D', _decode(b[i])]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        debug('commit', commit);
        // Remove the first empty char from the array
        commit.shift();
        let parsed = {};
        if (nameStatus) {
            // Create arrays for non optional fields if turned on
            notOptFields.forEach(function (d) {
                parsed[d] = [];
            });
        }
        commit.forEach(function (commitField, index) {
            if (fields[index]) {
                if (fields[index] === 'tags') {
                    let tags = [];
                    let start = commitField.indexOf('tag: ');
                    if (start >= 0) {
                        commitField.substr(start + 5).trim().split(',').forEach(function (tag) {
                            tags.push(tag.trim());
                        });
                    }
                    parsed[fields[index]] = tags;
                }
                else {
                    parsed[fields[index]] = commitField;
                }
            }
            else {
                if (nameStatus) {
                    let pos = (index - fields.length) % notOptFields.length;
                    debug('nameStatus', (index - fields.length), notOptFields.length, pos, commitField);
                    parsed[notOptFields[pos]].push(commitField);
                }
            }
        });
        if (nameStatus && options.nameStatusFiles) {
            parsed.fileStatus = array_hyper_unique_1.array_unique(nameStatusFiles);
        }
        parsed = sortObjectKeys(parsed, exports.KEY_ORDER);
        return parsed;
    });
}
exports.parseCommits = parseCommits;
/***
 Add optional parameter to command
 */
function addOptional(command, options) {
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer'];
    for (let i = cmdOptional.length; i--;) {
        if (options[cmdOptional[i]]) {
            command += ' --' + cmdOptional[i] + '="' + options[cmdOptional[i]] + '"';
        }
    }
    return command;
}
exports.defaultFields = ['abbrevHash', 'hash', 'subject', 'authorName'];
exports.defaultOptions = {
    number: 10,
    fields: exports.defaultFields,
    nameStatus: true,
    findCopiesHarder: false,
    all: false,
};
exports.KEY_ORDER = [
    'hash',
    'abbrevHash',
    'treeHash',
    'abbrevTreeHash',
    'parentHashes',
    'abbrevParentHashes',
    'authorName',
    'authorEmail',
    'authorDate',
    'authorDateRel',
    'committerName',
    'committerEmail',
    'committerDate',
    'committerDateRel',
    'subject',
    'body',
    'rawBody',
    'tags',
    'status',
    'files',
    'fileStatus',
];
function sync(options) {
    return gitlog(options);
}
exports.sync = sync;
function asyncCallback(options, cb) {
    if (typeof cb !== 'function') {
        throw new TypeError();
    }
    // @ts-ignore
    return gitlog(options, cb);
}
exports.asyncCallback = asyncCallback;
function async(options) {
    return new Promise(function (resolve, reject) {
        gitlog(options, function (error, commits) {
            if (error) {
                reject(error);
            }
            else {
                resolve(commits);
            }
        });
    });
}
exports.async = async;
function _decode(file) {
    if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/)) {
        file = file.replace(/^"|"$/g, '');
        file = git_decode_1.decode(file);
    }
    return file;
}
exports.default = gitlog;
// @ts-ignore
Object.freeze(exports);
