"use strict";
/**
 * Created by user on 2019/1/6/006.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const array_hyper_unique_1 = require("array-hyper-unique");
const debug0 = require("debug");
const fs_1 = require("fs");
const git_decode_1 = require("git-decode");
const type_1 = require("./type");
const extend = require("lodash.assign");
const _decamelize = require("decamelize");
const sortObjectKeys = require("sort-object-keys2");
const crlf_normalize_1 = require("crlf-normalize");
exports.debug = debug0('gitlog');
function handleOptions(options) {
    // lazy name
    const REPO = (options.repo && options.repo != null) ? options.repo : options.cwd;
    if (!REPO)
        throw new Error(`Repo required!, but got "${REPO}"`);
    if (!fs_1.existsSync(REPO))
        throw new Error(`Repo location does not exist: "${REPO}"`);
    let defaultExecOptions = {
        cwd: REPO,
        stripAnsi: true,
    };
    // Set defaults
    options = extend({}, type_1.defaultOptions, { execOptions: defaultExecOptions }, options);
    options.execOptions = extend(options.execOptions, defaultExecOptions);
    if (options.returnAllFields) {
        options.fields = [].concat(Object.keys(type_1.fields));
        if (options.nameStatus && typeof options.nameStatusFiles == 'undefined') {
            options.nameStatusFiles = true;
        }
    }
    return options;
}
exports.handleOptions = handleOptions;
function buildCommands(options) {
    // Start constructing command
    let bin = 'git';
    let commands = [
        'log',
    ];
    commands = addFlagsBool(commands, options, [
        'findCopiesHarder',
        'all',
    ]);
    if (options.number > 0) {
        commands.push('-n', options.number);
    }
    commands = addFlagsBool(commands, options, [
        'noMerges',
        'firstParent',
    ]);
    if (options.displayFilesChangedDuringMerge) {
        commands.push('-m');
    }
    commands = addOptional(commands, options);
    commands = addPrettyFormat(commands, options, "pretty" /* PRETTY */);
    // Append branch (revision range) if specified
    if (options.branch) {
        commands.push(options.branch);
    }
    //File and file status
    commands = addFlagsBool(commands, options, [
        'nameStatus',
        'merges',
        'fullHistory',
        'sparse',
        'simplifyMerges',
    ]);
    if (options.file || options.files && options.files.length) {
        let ls = [options.file].concat(options.files || []).filter(v => v != null);
        if (!ls.length) {
            throw new TypeError(`file list is empty`);
        }
        commands = addFlagsBool(commands, options, [
            'follow',
        ]);
        commands.push('--', ...ls);
    }
    else if (options.follow) {
        throw new TypeError(`options.follow works only for a single file`);
    }
    exports.debug('command', options.execOptions, commands);
    return { bin, commands };
}
exports.buildCommands = buildCommands;
function addPrettyFormat(commands, options, flagName = "pretty" /* PRETTY */) {
    // Start of custom format
    // Iterating through the fields and adding them to the custom format
    let command = options.fields.reduce(function (command, field) {
        if (!type_1.fields[field] && type_1.notOptFields.indexOf(field) === -1)
            throw new RangeError('Unknown field: ' + field);
        command.push("\t" /* DELIMITER */ + type_1.fields[field]);
        return command;
    }, [`${toFlag(flagName)}=${"@begin@" /* BEGIN */}`])
        .concat(["@end@" /* END */])
        .join("" /* JOIN */);
    commands.push(command);
    return commands;
}
exports.addPrettyFormat = addPrettyFormat;
function decode(file) {
    if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/)) {
        file = file.replace(/^"|"$/g, '');
        file = git_decode_1.decode(file);
    }
    return file;
}
exports.decode = decode;
function decamelize(key) {
    return _decamelize(key, '-');
}
exports.decamelize = decamelize;
function toFlag(key) {
    return '--' + decamelize(key);
}
exports.toFlag = toFlag;
function addFlagsBool(commands, options, flagNames) {
    for (let k of flagNames) {
        if (options[k]) {
            commands.push(toFlag(k));
        }
    }
    return commands;
}
exports.addFlagsBool = addFlagsBool;
/***
 Add optional parameter to command
 */
function addOptional(commands, options) {
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer', 'skip'];
    for (let k of cmdOptional) {
        if (options[k]) {
            commands.push(`--${k}=${options[k]}`);
        }
    }
    return commands;
}
exports.addOptional = addOptional;
function parseCommitFields(parsed, commitField, index, fields) {
    let key = fields[index];
    switch (key) {
        case 'tags':
            let tags = [];
            let start = commitField.indexOf('tag: ');
            if (start >= 0) {
                commitField
                    .substr(start + 5)
                    .trim()
                    .split(',')
                    .forEach(function (tag) {
                    tags.push(tag.trim());
                });
            }
            parsed[key] = tags;
            break;
        case 'authorDateUnixTimestamp':
        case 'committerDateUnixTimestamp':
            parsed[key] = parseInt(commitField);
            break;
        default:
            parsed[key] = commitField;
            break;
    }
    return parsed;
}
exports.parseCommitFields = parseCommitFields;
function parseCommits(commits, options) {
    let { fields, nameStatus } = options;
    return commits.map(function (_commit, _index) {
        //console.log(_commit);
        let parts = _commit.split("@end@" /* END */);
        let commit = parts[0].split(type_1.delimiter);
        let nameStatusFiles = [];
        if (parts[1]) {
            let parseNameStatus = parts[1].trimLeft().split(crlf_normalize_1.LF);
            // Removes last empty char if exists
            if (parseNameStatus[parseNameStatus.length - 1] === '') {
                parseNameStatus.pop();
            }
            parseNameStatus = parseNameStatus
                // Split each line into it's own delimitered array
                .map(function (d, i) {
                return d.split(type_1.delimiter);
            })
                // 0 will always be status, last will be the filename as it is in the commit,
                // anything inbetween could be the old name if renamed or copied
                .reduce(function (a, b) {
                let tempArr = [b[0], b[b.length - 1]];
                tempArr[1] = decode(tempArr[1]);
                // @ts-ignore
                nameStatusFiles.push(tempArr);
                // If any files in between loop through them
                for (let i = 1, len = b.length - 1; i < len; i++) {
                    // If status R then add the old filename as a deleted file + status
                    // Other potentials are C for copied but this wouldn't require the original deleting
                    if (b[0].slice(0, 1) === type_1.EnumFileStatus.RENAMED) {
                        tempArr.push(type_1.EnumFileStatus.DELETED, b[i]);
                        // @ts-ignore
                        nameStatusFiles.push([type_1.EnumFileStatus.DELETED, decode(b[i])]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        exports.debug('commit', commit);
        // Remove the first empty char from the array
        commit.shift();
        let parsed = {
            _index,
        };
        if (nameStatus) {
            // Create arrays for non optional fields if turned on
            type_1.notOptFields.forEach(function (d) {
                parsed[d] = [];
            });
        }
        commit.forEach(function (commitField, index) {
            if (fields[index]) {
                parsed = parseCommitFields(parsed, commitField, index, fields);
            }
            else {
                if (nameStatus) {
                    let pos = (index - fields.length) % type_1.notOptFields.length;
                    exports.debug('nameStatus', (index - fields.length), type_1.notOptFields.length, pos, commitField);
                    parsed[type_1.notOptFields[pos]].push(commitField);
                }
            }
        });
        if (nameStatus && options.nameStatusFiles) {
            parsed.fileStatus = array_hyper_unique_1.array_unique(nameStatusFiles);
        }
        // @ts-ignore
        parsed = sortObjectKeys(parsed, type_1.KEY_ORDER);
        return parsed;
    });
}
exports.parseCommits = parseCommits;
function parseCommitsStdout(options, stdout) {
    let str;
    exports.debug('stdout', stdout);
    if (options.fnHandleBuffer) {
        str = options.fnHandleBuffer(stdout);
    }
    else {
        str = stdout.toString();
    }
    //console.log(str);
    let commits = str.split("@begin@" /* BEGIN */);
    if (commits[0] === '') {
        commits.shift();
    }
    exports.debug('commits', commits);
    commits = parseCommits(commits, options);
    exports.debug('commits:parsed', commits);
    return commits;
}
exports.parseCommitsStdout = parseCommitsStdout;
function createError(message, data, err) {
    // @ts-ignore
    err = err || Error;
    let e = message instanceof Error ? message : new err(message);
    // @ts-ignore
    e.data = data;
    // @ts-ignore
    return e;
}
exports.createError = createError;
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILDJEQUFrRDtBQUNsRCxnQ0FBaUM7QUFDakMsMkJBQWdDO0FBQ2hDLDJDQUErQztBQUMvQyxpQ0FVZ0I7QUFDaEIsd0NBQXlDO0FBQ3pDLDBDQUEyQztBQUMzQyxvREFBcUQ7QUFFckQsbURBQW9DO0FBRXZCLFFBQUEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUV0QyxTQUFnQixhQUFhLENBQUMsT0FBaUI7SUFFOUMsWUFBWTtJQUNaLE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBRWpGLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoRSxJQUFJLENBQUMsZUFBVSxDQUFDLElBQUksQ0FBQztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLElBQUksR0FBRyxDQUFDLENBQUM7SUFFbEYsSUFBSSxrQkFBa0IsR0FBcUI7UUFDMUMsR0FBRyxFQUFFLElBQUk7UUFDVCxTQUFTLEVBQUUsSUFBSTtLQUNmLENBQUM7SUFFRixlQUFlO0lBQ2YsT0FBTyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUscUJBQWMsRUFBRSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25GLE9BQU8sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUV0RSxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQzNCO1FBQ0MsT0FBTyxD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Q0FBQztJQUVuQixJQUFJLENBQUMsR0FBRyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTlELGFBQWE7SUFDYixDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUVkLGFBQWE7SUFDYixPQUFPLENBQUMsQ0FBQztBQUNWLENBQUM7QUFqQkQsa0NBaUJDO0FBRUQsYUFBYTtBQUNiLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE5LzEvNi8wMDYuXG4gKi9cblxuaW1wb3J0IHsgYXJyYXlfdW5pcXVlIH0gZnJvbSAnYXJyYXktaHlwZXItdW5pcXVlJztcbmltcG9ydCBkZWJ1ZzAgPSByZXF1aXJlKCdkZWJ1ZycpO1xuaW1wb3J0IHsgZXhpc3RzU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgZGVjb2RlIGFzIF9kZWNvZGUgfSBmcm9tICdnaXQtZGVjb2RlJztcbmltcG9ydCB7XG5cdGRlZmF1bHRPcHRpb25zLFxuXHRkZWxpbWl0ZXIsIEVudW1GaWxlU3RhdHVzLCBFbnVtUHJldHR5Rm9ybWF0RmxhZ3MsIEVudW1QcmV0dHlGb3JtYXRNYXJrLFxuXHRmaWVsZHMsXG5cdElDb21tYW5kcywgSUZpZWxkc0FycmF5LFxuXHRJT3B0aW9ucywgSU9wdGlvbnNHaXRGbG9ncywgSU9wdGlvbnNHaXRXaXRoVmFsdWUsIElPcHRpb25zR2l0RmxvZ3NFeHRyYSxcblx0SVBhcnNlQ29tbWl0LFxuXHRJUmV0dXJuQ29tbWl0cyxcblx0S0VZX09SREVSLFxuXHRub3RPcHRGaWVsZHMsXG59IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgZXh0ZW5kID0gcmVxdWlyZSgnbG9kYXNoLmFzc2lnbicpO1xuaW1wb3J0IF9kZWNhbWVsaXplID0gcmVxdWlyZSgnZGVjYW1lbGl6ZScpO1xuaW1wb3J0IHNvcnRPYmplY3RLZXlzID0gcmVxdWlyZSgnc29ydC1vYmplY3Qta2V5czInKTtcbmltcG9ydCB7IFNwYXduU3luY09wdGlvbnMgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS9jb3JlJztcbmltcG9ydCB7IExGIH0gZnJvbSAnY3JsZi1ub3JtYWxpemUnO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBkZWJ1ZzAoJ2dpdGxvZycpO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucylcbntcblx0Ly8gbGF6eSBuYW1lXG5cdGNvbnN0IFJFUE8gPSAob3B0aW9ucy5yZXBvICYmIG9wdGlvbnMucmVwbyAhPSBudWxsKSA/IG9wdGlvbnMucmVwbyA6IG9wdGlvbnMuY3dkO1xuXG5cdGlmICghUkVQTykgdGhyb3cgbmV3IEVycm9yKGBSZXBvIHJlcXVpcmVkISwgYnV0IGdvdCBcIiR7UkVQT31cImApO1xuXHRpZiAoIWV4aXN0c1N5bmMoUkVQTykpIHRocm93IG5ldyBFcnJvcihgUmVwbyBsb2NhdGlvbiBkb2VzIG5vdCBleGlzdDogXCIke1JFUE99XCJgKTtcblxuXHRsZXQgZGVmYXVsdEV4ZWNPcHRpb25zOiBTcGF3blN5bmNPcHRpb25zID0ge1xuXHRcdGN3ZDogUkVQTyxcblx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdH07XG5cblx0Ly8gU2V0IGRlZmF1bHRzXG5cdG9wdGlvbnMgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCB7IGV4ZWNPcHRpb25zOiBkZWZhdWx0RXhlY09wdGlvbnMgfSwgb3B0aW9ucyk7XG5cdG9wdGlvbnMuZXhlY09wdGlvbnMgPSBleHRlbmQob3B0aW9ucy5leGVjT3B0aW9ucywgZGVmYXVsdEV4ZWNPcHRpb25zKTtcblxuXHRpZiAob3B0aW9ucy5yZXR1cm5BbGxGaWVsZHMpXG5cdHtcblx0XHRvcHRpb25zLmZpZWxkcyA9IFtdLmNvbmNhdChPYmplY3Qua2V5cyhmaWVsZHMpKTtcblxuXHRcdGlmIChvcHRpb25zLm5hbWVTdGF0dXMgJiYgdHlwZW9mIG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzID09ICd1bmRlZmluZWQnKVxuXHRcdHtcblx0XHRcdG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29tbWFuZHMob3B0aW9uczogSU9wdGlvbnMpOiB7XG5cdGJpbjogc3RyaW5nLFxuXHRjb21tYW5kczogSUNvbW1hbmRzLFxufVxue1xuXHQvLyBTdGFydCBjb25zdHJ1Y3RpbmcgY29tbWFuZFxuXG5cdGxldCBiaW4gPSAnZ2l0Jztcblx0bGV0IGNvbW1hbmRzOiBJQ29tbWFuZHMgPSBbXG5cdFx0J2xvZycsXG5cdF07XG5cblx0Y29tbWFuZHMgPSBhZGRGbGFnc0Jvb2woY29tbWFuZHMsIG9wdGlvbnMsIFtcblx0XHQnZmluZENvcGllc0hhcmRlcicsXG5cdFx0J2FsbCcsXG5cdF0pO1xuXG5cdGlmIChvcHRpb25zLm51bWJlciA+IDApXG5cdHtcblx0XHRjb21tYW5kcy5wdXNoKCctbicsIG9wdGlvbnMubnVtYmVyKTtcblx0fVxuXG5cdGNvbW1hbmRzID0gYWRkRmxhZ3NCb29sKGNvbW1hbmRzLCBvcHRpb25zLCBbXG5cdFx0J25vTWVyZ2VzJyxcblx0XHQnZmlyc3RQYXJlbnQnLFxuXHRdKTtcblxuXHRpZiAob3B0aW9ucy5kaXNwbGF5RmlsZXNDaGFuZ2VkRHVyaW5nTWVyZ2UpXG5cdHtcblx0XHRjb21tYW5kcy5wdXNoKCctbScpO1xuXHR9XG5cblx0Y29tbWFuZHMgPSBhZGRPcHRpb25hbChjb21tYW5kcywgb3B0aW9ucyk7XG5cblx0Y29tbWFuZHMgPSBhZGRQcmV0dHlGb3JtYXQoY29tbWFuZHMsIG9wdGlvbnMsIEVudW1QcmV0dHlGb3JtYXRGbGFncy5QUkVUVFkpO1xuXG5cdC8vIEFwcGVuZCBicmFuY2ggKHJldmlzaW9uIHJhbmdlKSBpZiBzcGVjaWZpZWRcblx0aWYgKG9wdGlvbnMuYnJhbmNoKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaChvcHRpb25zLmJyYW5jaCk7XG5cdH1cblxuXHQvL0ZpbGUgYW5kIGZpbGUgc3RhdHVzXG5cdGNvbW1hbmRzID0gYWRkRmxhZ3NCb29sKGNvbW1hbmRzLCBvcHRpb25zLCBbXG5cdFx0J25hbWVTdGF0dXMnLFxuXHRcdCdtZXJnZXMnLFxuXHRcdCdmdWxsSGlzdG9yeScsXG5cdFx0J3NwYXJzZScsXG5cdFx0J3NpbXBsaWZ5TWVyZ2VzJyxcblx0XSk7XG5cblx0aWYgKG9wdGlvbnMuZmlsZSB8fCBvcHRpb25zLmZpbGVzICYmIG9wdGlvbnMuZmlsZXMubGVuZ3RoKVxuXHR7XG5cdFx0bGV0IGxzID0gW29wdGlvbnMuZmlsZV0uY29uY2F0KG9wdGlvbnMuZmlsZXMgfHwgW10pLmZpbHRlcih2ID0+IHYgIT0gbnVsbCk7XG5cblx0XHRpZiAoIWxzLmxlbmd0aClcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBmaWxlIGxpc3QgaXMgZW1wdHlgKTtcblx0XHR9XG5cblx0XHRjb21tYW5kcyA9IGFkZEZsYWdzQm9vbChjb21tYW5kcywgb3B0aW9ucywgW1xuXHRcdFx0J2ZvbGxvdycsXG5cdFx0XSk7XG5cblx0XHRjb21tYW5kcy5wdXNoKCctLScsIC4uLmxzKTtcblx0fVxuXHRlbHNlIGlmIChvcHRpb25zLmZvbGxvdylcblx0e1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG9wdGlvbnMuZm9sbG93IHdvcmtzIG9ubHkgZm9yIGEgc2luZ2xlIGZpbGVgKVxuXHR9XG5cblx0ZGVidWcoJ2NvbW1hbmQnLCBvcHRpb25zLmV4ZWNPcHRpb25zLCBjb21tYW5kcyk7XG5cblx0cmV0dXJuIHsgYmluLCBjb21tYW5kcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQcmV0dHlGb3JtYXQoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMsIGZsYWdOYW1lID0gRW51bVByZXR0eUZvcm1hdEZsYWdzLlBSRVRUWSlcbntcblx0Ly8gU3RhcnQgb2YgY3VzdG9tIGZvcm1hdFxuXHQvLyBJdGVyYXRpbmcgdGhyb3VnaCB0aGUgZmllbGRzIGFuZCBhZGRpbmcgdGhlbSB0byB0aGUgY3VzdG9tIGZvcm1hdFxuXHRsZXQgY29tbWFuZCA9IG9wdGlvbnMuZmllbGRzLnJlZHVjZShmdW5jdGlvbiAoY29tbWFuZCwgZmllbGQpXG5cdFx0e1xuXHRcdFx0aWYgKCFmaWVsZHNbZmllbGRdICYmIG5vdE9wdEZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHRocm93IG5ldyBSYW5nZUVycm9yKCdVbmtub3duIGZpZWxkOiAnICsgZmllbGQpO1xuXG5cdFx0XHRjb21tYW5kLnB1c2goRW51bVByZXR0eUZvcm1hdE1hcmsuREVMSU1JVEVSICsgZmllbGRzW2ZpZWxkXSk7XG5cblx0XHRcdHJldHVybiBjb21tYW5kO1xuXHRcdH0sIFtgJHt0b0ZsYWcoZmxhZ05hbWUpfT0ke0VudW1QcmV0dHlGb3JtYXRNYXJrLkJFR0lOfWBdKVxuXHRcdC5jb25jYXQoW0VudW1QcmV0dHlGb3JtYXRNYXJrLkVORF0pXG5cdFx0LmpvaW4oRW51bVByZXR0eUZvcm1hdE1hcmsuSk9JTik7XG5cblx0Y29tbWFuZHMucHVzaChjb21tYW5kKTtcblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShmaWxlOiBzdHJpbmcpOiBzdHJpbmdcbntcblx0aWYgKGZpbGUuaW5kZXhPZignXCInKSA9PSAwIHx8IGZpbGUubWF0Y2goLyg/OlxcXFwoXFxkezN9KSkvKSlcblx0e1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoL15cInxcIiQvZywgJycpO1xuXG5cdFx0ZmlsZSA9IF9kZWNvZGUoZmlsZSk7XG5cdH1cblxuXHRyZXR1cm4gZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2FtZWxpemUoa2V5OiBzdHJpbmcpOiBzdHJpbmdcbntcblx0cmV0dXJuIF9kZWNhbWVsaXplKGtleSwgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GbGFnKGtleTogc3RyaW5nKVxue1xuXHRyZXR1cm4gJy0tJyArIGRlY2FtZWxpemUoa2V5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZsYWdzQm9vbChjb21tYW5kczogSUNvbW1hbmRzLCBvcHRpb25zOiBJT3B0aW9ucywgZmxhZ05hbWVzOiAoa2V5b2YgSU9wdGlvbnNHaXRGbG9ncylbXSlcbntcblx0Zm9yIChsZXQgayBvZiBmbGFnTmFtZXMpXG5cdHtcblx0XHRpZiAob3B0aW9uc1trXSlcblx0XHR7XG5cdFx0XHRjb21tYW5kcy5wdXNoKHRvRmxhZyhrKSlcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuLyoqKlxuIEFkZCBvcHRpb25hbCBwYXJhbWV0ZXIgdG8gY29tbWFuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkT3B0aW9uYWwoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMpXG57XG5cdGxldCBjbWRPcHRpb25hbDogKGtleW9mIElPcHRpb25zR2l0V2l0aFZhbHVlKVtdID0gWydhdXRob3InLCAnc2luY2UnLCAnYWZ0ZXInLCAndW50aWwnLCAnYmVmb3JlJywgJ2NvbW1pdHRlcicsICdza2lwJ107XG5cdGZvciAobGV0IGsgb2YgY21kT3B0aW9uYWwpXG5cdHtcblx0XHRpZiAob3B0aW9uc1trXSlcblx0XHR7XG5cdFx0XHRjb21tYW5kcy5wdXNoKGAtLSR7a309JHtvcHRpb25zW2tdfWApXG5cdFx0fVxuXHR9XG5cdHJldHVybiBjb21tYW5kc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21taXRGaWVsZHMocGFyc2VkOiBJUGFyc2VDb21taXQsIGNvbW1pdEZpZWxkOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGZpZWxkczogSUZpZWxkc0FycmF5KVxue1xuXHRsZXQga2V5ID0gZmllbGRzW2luZGV4XTtcblxuXHRzd2l0Y2ggKGtleSlcblx0e1xuXHRcdGNhc2UgJ3RhZ3MnOlxuXHRcdFx0bGV0IHRhZ3MgPSBbXTtcblx0XHRcdGxldCBzdGFydCA9IGNvbW1pdEZpZWxkLmluZGV4T2YoJ3RhZzogJyk7XG5cdFx0XHRpZiAoc3RhcnQgPj0gMClcblx0XHRcdHtcblx0XHRcdFx0Y29tbWl0RmllbGRcblx0XHRcdFx0XHQuc3Vic3RyKHN0YXJ0ICsgNSlcblx0XHRcdFx0XHQudHJpbSgpXG5cdFx0XHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdFx0XHQuZm9yRWFjaChmdW5jdGlvbiAodGFnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRhZ3MucHVzaCh0YWcudHJpbSgpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9XG5cdFx0XHRwYXJzZWRba2V5XSA9IHRhZ3M7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdhdXRob3JEYXRlVW5peFRpbWVzdGFtcCc6XG5cdFx0Y2FzZSAnY29tbWl0dGVyRGF0ZVVuaXhUaW1lc3RhbXAnOlxuXHRcdFx0cGFyc2VkW2tleV0gPSBwYXJzZUludChjb21taXRGaWVsZCk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0cGFyc2VkW2tleV0gPSBjb21taXRGaWVsZDtcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWl0cyhjb21taXRzOiBzdHJpbmdbXSwgb3B0aW9uczogSU9wdGlvbnMpOiBJUmV0dXJuQ29tbWl0c1xue1xuXHRsZXQgeyBmaWVsZHMsIG5hbWVTdGF0dXMgfSA9IG9wdGlvbnM7XG5cblx0cmV0dXJuIGNvbW1pdHMubWFwKGZ1bmN0aW9uIChfY29tbWl0LCBfaW5kZXgpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKF9jb21taXQpO1xuXG5cdFx0bGV0IHBhcnRzID0gX2NvbW1pdC5zcGxpdChFbnVtUHJldHR5Rm9ybWF0TWFyay5FTkQpO1xuXG5cdFx0bGV0IGNvbW1pdCA9IHBhcnRzWzBdLnNwbGl0KGRlbGltaXRlcik7XG5cblx0XHRsZXQgbmFtZVN0YXR1c0ZpbGVzOiBJUGFyc2VDb21taXRbXCJmaWxlU3RhdHVzXCJdID0gW107XG5cblx0XHRpZiAocGFydHNbMV0pXG5cdFx0e1xuXHRcdFx0bGV0IHBhcnNlTmFtZVN0YXR1cyA9IHBhcnRzWzFdLnRyaW1MZWZ0KCkuc3BsaXQoTEYpO1xuXG5cdFx0XHQvLyBSZW1vdmVzIGxhc3QgZW1wdHkgY2hhciBpZiBleGlzdHNcblx0XHRcdGlmIChwYXJzZU5hbWVTdGF0dXNbcGFyc2VOYW1lU3RhdHVzLmxlbmd0aCAtIDFdID09PSAnJylcblx0XHRcdHtcblx0XHRcdFx0cGFyc2VOYW1lU3RhdHVzLnBvcCgpXG5cdFx0XHR9XG5cblx0XHRcdHBhcnNlTmFtZVN0YXR1cyA9IHBhcnNlTmFtZVN0YXR1c1xuXHRcdFx0Ly8gU3BsaXQgZWFjaCBsaW5lIGludG8gaXQncyBvd24gZGVsaW1pdGVyZWQgYXJyYXlcblx0XHRcdFx0Lm1hcChmdW5jdGlvbiAoZCwgaSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBkLnNwbGl0KGRlbGltaXRlcik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vIDAgd2lsbCBhbHdheXMgYmUgc3RhdHVzLCBsYXN0IHdpbGwgYmUgdGhlIGZpbGVuYW1lIGFzIGl0IGlzIGluIHRoZSBjb21taXQsXG5cdFx0XHRcdC8vIGFueXRoaW5nIGluYmV0d2VlbiBjb3VsZCBiZSB0aGUgb2xkIG5hbWUgaWYgcmVuYW1lZCBvciBjb3BpZWRcblx0XHRcdFx0LnJlZHVjZShmdW5jdGlvbiAoYSwgYilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCB0ZW1wQXJyOiBbRW51bUZpbGVTdGF0dXMsIHN0cmluZ10gPSBbYlswXSBhcyBFbnVtRmlsZVN0YXR1cywgYltiLmxlbmd0aCAtIDFdXTtcblxuXHRcdFx0XHRcdHRlbXBBcnJbMV0gPSBkZWNvZGUodGVtcEFyclsxXSk7XG5cblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0bmFtZVN0YXR1c0ZpbGVzLnB1c2godGVtcEFycik7XG5cblx0XHRcdFx0XHQvLyBJZiBhbnkgZmlsZXMgaW4gYmV0d2VlbiBsb29wIHRocm91Z2ggdGhlbVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAxLCBsZW4gPSBiLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQvLyBJZiBzdGF0dXMgUiB0aGVuIGFkZCB0aGUgb2xkIGZpbGVuYW1lIGFzIGEgZGVsZXRlZCBmaWxlICsgc3RhdHVzXG5cdFx0XHRcdFx0XHQvLyBPdGhlciBwb3RlbnRpYWxzIGFyZSBDIGZvciBjb3BpZWQgYnV0IHRoaXMgd291bGRuJ3QgcmVxdWlyZSB0aGUgb3JpZ2luYWwgZGVsZXRpbmdcblx0XHRcdFx0XHRcdGlmIChiWzBdLnNsaWNlKDAsIDEpID09PSBFbnVtRmlsZVN0YXR1cy5SRU5BTUVEKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZW1wQXJyLnB1c2goRW51bUZpbGVTdGF0dXMuREVMRVRFRCwgYltpXSk7XG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0bmFtZVN0YXR1c0ZpbGVzLnB1c2goW0VudW1GaWxlU3RhdHVzLkRFTEVURUQsIGRlY29kZShiW2ldKV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBhLmNvbmNhdCh0ZW1wQXJyKTtcblx0XHRcdFx0fSwgW10pXG5cdFx0XHQ7XG5cblx0XHRcdGNvbW1pdCA9IGNvbW1pdC5jb25jYXQocGFyc2VOYW1lU3RhdHVzKVxuXHRcdH1cblxuXHRcdGRlYnVnKCdjb21taXQnLCBjb21taXQpO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBmaXJzdCBlbXB0eSBjaGFyIGZyb20gdGhlIGFycmF5XG5cdFx0Y29tbWl0LnNoaWZ0KCk7XG5cblx0XHRsZXQgcGFyc2VkOiBJUGFyc2VDb21taXQgPSB7XG5cdFx0XHRfaW5kZXgsXG5cdFx0fTtcblxuXHRcdGlmIChuYW1lU3RhdHVzKVxuXHRcdHtcblx0XHRcdC8vIENyZWF0ZSBhcnJheXMgZm9yIG5vbiBvcHRpb25hbCBmaWVsZHMgaWYgdHVybmVkIG9uXG5cdFx0XHRub3RPcHRGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZClcblx0XHRcdHtcblx0XHRcdFx0cGFyc2VkW2RdID0gW107XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdGNvbW1pdC5mb3JFYWNoKGZ1bmN0aW9uIChjb21taXRGaWVsZCwgaW5kZXgpXG5cdFx0e1xuXHRcdFx0aWYgKGZpZWxkc1tpbmRleF0pXG5cdFx0XHR7XG5cdFx0XHRcdHBhcnNlZCA9IHBhcnNlQ29tbWl0RmllbGRzKHBhcnNlZCwgY29tbWl0RmllbGQsIGluZGV4LCBmaWVsZHMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAobmFtZVN0YXR1cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBwb3MgPSAoaW5kZXggLSBmaWVsZHMubGVuZ3RoKSAlIG5vdE9wdEZpZWxkcy5sZW5ndGg7XG5cblx0XHRcdFx0XHRkZWJ1ZygnbmFtZVN0YXR1cycsIChpbmRleCAtIGZpZWxkcy5sZW5ndGgpLCBub3RPcHRGaWVsZHMubGVuZ3RoLCBwb3MsIGNvbW1pdEZpZWxkKTtcblx0XHRcdFx0XHRwYXJzZWRbbm90T3B0RmllbGRzW3Bvc11dLnB1c2goY29tbWl0RmllbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChuYW1lU3RhdHVzICYmIG9wdGlvbnMubmFtZVN0YXR1c0ZpbGVzKVxuXHRcdHtcblx0XHRcdHBhcnNlZC5maWxlU3RhdHVzID0gYXJyYXlfdW5pcXVlKG5hbWVTdGF0dXNGaWxlcykgYXMgdHlwZW9mIG5hbWVTdGF0dXNGaWxlcztcblx0XHR9XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGFyc2VkID0gc29ydE9iamVjdEtleXMocGFyc2VkLCBLRVlfT1JERVIpO1xuXG5cdFx0cmV0dXJuIHBhcnNlZFxuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21taXRzU3Rkb3V0KG9wdGlvbnM6IElPcHRpb25zLCBzdGRvdXQ6IEJ1ZmZlcik6IElSZXR1cm5Db21taXRzXG57XG5cdGxldCBzdHI6IHN0cmluZztcblxuXHRkZWJ1Zygnc3Rkb3V0Jywgc3Rkb3V0KTtcblxuXHRpZiAob3B0aW9ucy5mbkhhbmRsZUJ1ZmZlcilcblx0e1xuXHRcdHN0ciA9IG9wdGlvbnMuZm5IYW5kbGVCdWZmZXIoc3Rkb3V0KVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHN0ciA9IHN0ZG91dC50b1N0cmluZygpXG5cdH1cblxuXHQvL2NvbnNvbGUubG9nKHN0cik7XG5cblx0bGV0IGNvbW1pdHM6IHVua25vd25bXSA9IHN0ci5zcGxpdChFbnVtUHJldHR5Rm9ybWF0TWFyay5CRUdJTik7XG5cdGlmIChjb21taXRzWzBdID09PSAnJylcblx0e1xuXHRcdGNvbW1pdHMuc2hpZnQoKVxuXHR9XG5cdGRlYnVnKCdjb21taXRzJywgY29tbWl0cyk7XG5cblx0Y29tbWl0cyA9IHBhcnNlQ29tbWl0cyhjb21taXRzIGFzIHN0cmluZ1tdLCBvcHRpb25zKTtcblxuXHRkZWJ1ZygnY29tbWl0czpwYXJzZWQnLCBjb21taXRzKTtcblxuXHRyZXR1cm4gY29tbWl0cyBhcyBJUmV0dXJuQ29tbWl0cztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXN5bmNDYWxsYmFjazxFID0gUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRXJyb3I+Plxue1xuXHQoZXJyb3I6IEUsIGNvbW1pdHM6IElSZXR1cm5Db21taXRzKTogdm9pZCxcblx0KGVycm9yOiBuZXZlciwgY29tbWl0czogSVJldHVybkNvbW1pdHMpOiB2b2lkLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXJyb3I8RCBleHRlbmRzIGFueSwgRSBleHRlbmRzIEVycm9yPihtZXNzYWdlPywgZGF0YT86IEQsIGVycj86IHtcblx0bmV3ICgpOiBFLFxuXHRuZXcgKC4uLmFyZ3YpOiBFLFxufSk6IEUgJiB7XG5cdGRhdGE6IEQsXG59XG57XG5cdC8vIEB0cy1pZ25vcmVcblx0ZXJyID0gZXJyIHx8IEVycm9yO1xuXG5cdGxldCBlID0gbWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yID8gbWVzc2FnZSA6IG5ldyBlcnIobWVzc2FnZSk7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRlLmRhdGEgPSBkYXRhO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuIGU7XG59XG5cbi8vIEB0cy1pZ25vcmVcbk9iamVjdC5mcmVlemUoZXhwb3J0cyk7XG4iXX0=