"use strict";
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const extend = require("lodash.assign");
const debug_1 = require("debug");
const arrayUniq = require("array-uniq");
let debug = debug_1.default('gitlog'), delimiter = '\t', fields = {
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
    rawBody: '%B'
}, notOptFields = ['status', 'files'];
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
function gitlog(options, cb) {
    if (!options.repo)
        throw new Error('Repo required!');
    if (!fs_1.existsSync(options.repo))
        throw new Error('Repo location does not exist');
    let defaultOptions = {
        number: 10,
        fields: ['abbrevHash', 'hash', 'subject', 'authorName'],
        nameStatus: true,
        findCopiesHarder: false,
        all: false,
        execOptions: { cwd: options.repo }
    };
    // Set defaults
    options = extend({}, defaultOptions, options);
    extend(options.execOptions, defaultOptions.execOptions);
    // Start constructing command
    let command = 'git log ';
    if (options.findCopiesHarder) {
        command += '--find-copies-harder ';
    }
    if (options.all) {
        command += '--all ';
    }
    if (options.number > 0) {
        command += '-n ' + options.number;
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
                // If any files in between loop through them
                for (let i = 1, len = b.length - 1; i < len; i++) {
                    // If status R then add the old filename as a deleted file + status
                    // Other potentials are C for copied but this wouldn't require the original deleting
                    if (b[0].slice(0, 1) === 'R') {
                        tempArr.push('D', b[i]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            if (parseNameStatus.length && options.nameStatusFiles) {
                // @ts-ignore
                nameStatusFiles = parseNameStatus.slice();
            }
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
                parsed[fields[index]] = commitField;
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
            parsed.fileStatus = arrayUniq(nameStatusFiles);
        }
        return parsed;
    });
}
(function (gitlog) {
    function sync(options) {
        return gitlog(options);
    }
    gitlog.sync = sync;
    function asyncCallback(options, cb) {
        if (typeof cb !== 'function') {
            throw new TypeError();
        }
        // @ts-ignore
        return gitlog(options, cb);
    }
    gitlog.asyncCallback = asyncCallback;
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
    gitlog.async = async;
})(gitlog || (gitlog = {}));
// @ts-ignore
gitlog.default = gitlog.gitlog = gitlog;
module.exports = gitlog;
