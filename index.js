module.exports = gitlog;
var exec = require('child_process').exec, execSync = require('child_process').execSync, existsSync = require('fs').existsSync, debug = require('debug')('gitlog'), extend = require('lodash.assign'), delimiter = '\t', fields = { hash: '%H',
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
function addOptional(command, options) {
    var cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer'];
    for (var i = cmdOptional.length; i--;) {
        if (options[cmdOptional[i]]) {
            command += ' --' + cmdOptional[i] + '="' + options[cmdOptional[i]] + '"';
        }
    }
    return command;
}
function gitlog(options, cb) {
    if (!options.repo)
        throw new Error('Repo required!');
    if (!existsSync(options.repo))
        throw new Error('Repo location does not exist');
    var defaultOptions = { number: 10,
        fields: ['abbrevHash', 'hash', 'subject', 'authorName'],
        nameStatus: true,
        findCopiesHarder: false,
        all: false,
        execOptions: { cwd: options.repo }
    };
    options = extend({}, defaultOptions, options);
    extend(options.execOptions, defaultOptions.execOptions);
    var command = 'git log ';
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
    command += ' --pretty="@begin@';
    options.fields.forEach(function (field) {
        if (!fields[field] && field.indexOf(notOptFields) === -1)
            throw new Error('Unknown field: ' + field);
        command += delimiter + fields[field];
    });
    command += '@end@"';
    if (options.branch) {
        command += ' ' + options.branch;
    }
    if (options.file) {
        command += ' -- ' + options.file;
    }
    command += fileNameAndStatus(options);
    debug('command', options.execOptions, command);
    if (!cb) {
        var stdout = execSync(command, options.execOptions).toString(), commits = stdout.split('@begin@');
        if (commits[0] === '') {
            commits.shift();
        }
        debug('commits', commits);
        commits = parseCommits(commits, options.fields, options.nameStatus);
        return commits;
    }
    exec(command, options.execOptions, function (err, stdout, stderr) {
        debug('stdout', stdout);
        var commits = stdout.split('@begin@');
        if (commits[0] === '') {
            commits.shift();
        }
        debug('commits', commits);
        commits = parseCommits(commits, options.fields, options.nameStatus);
        cb(stderr || err, commits);
    });
}
function fileNameAndStatus(options) {
    return options.nameStatus ? ' --name-status' : '';
}
function parseCommits(commits, fields, nameStatus) {
    return commits.map(function (commit) {
        var parts = commit.split('@end@');
        commit = parts[0].split(delimiter);
        if (parts[1]) {
            var parseNameStatus = parts[1].trimLeft().split('\n');
            if (parseNameStatus[parseNameStatus.length - 1] === '') {
                parseNameStatus.pop();
            }
            parseNameStatus.forEach(function (d, i) {
                parseNameStatus[i] = d.split(delimiter);
            });
            parseNameStatus = parseNameStatus.reduce(function (a, b) {
                var tempArr = [b[0], b[b.length - 1]];
                for (var i = 1, len = b.length - 1; i < len; i++) {
                    if (b[0].slice(0, 1) === 'R') {
                        tempArr.push('D', b[i]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        debug('commit', commit);
        commit.shift();
        var parsed = {};
        if (nameStatus) {
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
                    var pos = (index - fields.length) % notOptFields.length;
                    debug('nameStatus', (index - fields.length), notOptFields.length, pos, commitField);
                    parsed[notOptFields[pos]].push(commitField);
                }
            }
        });
        return parsed;
    });
}
