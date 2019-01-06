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
    const REPO = typeof options.repo != 'undefined' ? options.repo : options.cwd;
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
    commands = addOptional(commands, options);
    {
        commands = addPrettyFormat(commands, options, "pretty" /* PRETTY */);
    }
    // Append branch (revision range) if specified
    if (options.branch) {
        commands.push(options.branch);
    }
    if (options.file) {
        commands.push('--', options.file);
        commands = addFlagsBool(commands, options, [
            'follow',
        ]);
    }
    else if (options.follow) {
        throw new TypeError(`options.follow works only for a single file`);
    }
    //File and file status
    commands = addFlagsBool(commands, options, [
        'nameStatus',
    ]);
    console.dir(commands);
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
    let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer'];
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
    return commits.map(function (_commit) {
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
                    if (b[0].slice(0, 1) === 'R') {
                        tempArr.push('D', b[i]);
                        // @ts-ignore
                        nameStatusFiles.push(['D', decode(b[i])]);
                    }
                }
                return a.concat(tempArr);
            }, []);
            commit = commit.concat(parseNameStatus);
        }
        exports.debug('commit', commit);
        // Remove the first empty char from the array
        commit.shift();
        let parsed = {};
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
// @ts-ignore
Object.freeze(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILDJEQUFrRDtBQUNsRCxnQ0FBaUM7QUFDakMsMkJBQWdDO0FBQ2hDLDJDQUErQztBQUMvQyxpQ0FVZ0I7QUFDaEIsd0NBQXlDO0FBQ3pDLDBDQUEyQztBQUMzQyxvREFBcUQ7QUFFckQsbURBQW9DO0FBRXZCLFFBQUEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUV0QyxTQUFnQixhQUFhLENBQUMsT0FBaUI7SUFFOUMsWUFBWTtJQUNaLE1BQU0sSUFBSSxHQUFHLE9BQU8sT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFFN0UsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2hFLElBQUksQ0FBQyxlQUFVLENBQUMsSUFBSSxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUVsRixJQUFJLGtCQUFrQixHQUFxQjtRQUMxQyxHQUFHLEVBQUUsSUFBSTtRQUNULFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FBQztJQUVGLGVBQWU7SUFDZixPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxxQkFBYyxFQUFFLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkYsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRXRFLElBQUksT0FBTyxDQUFDLGVBQWUsRUFDM0I7UUFDQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxN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QUFDLFFBQVEsRUFBRSxDQUFBO0tBQ3ZCO0lBRUQsbUJBQW1CO0lBRW5CLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLHVCQUE4QyxDQUFDO0lBQ3RFLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFDckI7UUFDQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDZjtJQUNELGFBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFMUIsT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXJELGFBQUssQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVqQyxPQUFPLE9BQU8sQ0FBQztBQUNoQixDQUFDO0FBN0JELGdEQTZCQztBQU9ELGFBQWE7QUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS8xLzYvMDA2LlxuICovXG5cbmltcG9ydCB7IGFycmF5X3VuaXF1ZSB9IGZyb20gJ2FycmF5LWh5cGVyLXVuaXF1ZSc7XG5pbXBvcnQgZGVidWcwID0gcmVxdWlyZSgnZGVidWcnKTtcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGRlY29kZSBhcyBfZGVjb2RlIH0gZnJvbSAnZ2l0LWRlY29kZSc7XG5pbXBvcnQge1xuXHRkZWZhdWx0T3B0aW9ucyxcblx0ZGVsaW1pdGVyLCBFbnVtUHJldHR5Rm9ybWF0RmxhZ3MsIEVudW1QcmV0dHlGb3JtYXRNYXJrLFxuXHRmaWVsZHMsXG5cdElDb21tYW5kcywgSUZpZWxkc0FycmF5LFxuXHRJT3B0aW9ucyxcblx0SVBhcnNlQ29tbWl0LFxuXHRJUmV0dXJuQ29tbWl0cyxcblx0S0VZX09SREVSLFxuXHRub3RPcHRGaWVsZHMsXG59IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgZXh0ZW5kID0gcmVxdWlyZSgnbG9kYXNoLmFzc2lnbicpO1xuaW1wb3J0IF9kZWNhbWVsaXplID0gcmVxdWlyZSgnZGVjYW1lbGl6ZScpO1xuaW1wb3J0IHNvcnRPYmplY3RLZXlzID0gcmVxdWlyZSgnc29ydC1vYmplY3Qta2V5czInKTtcbmltcG9ydCB7IFNwYXduU3luY09wdGlvbnMgfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYS9jb3JlJztcbmltcG9ydCB7IExGIH0gZnJvbSAnY3JsZi1ub3JtYWxpemUnO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBkZWJ1ZzAoJ2dpdGxvZycpO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlT3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucylcbntcblx0Ly8gbGF6eSBuYW1lXG5cdGNvbnN0IFJFUE8gPSB0eXBlb2Ygb3B0aW9ucy5yZXBvICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5yZXBvIDogb3B0aW9ucy5jd2Q7XG5cblx0aWYgKCFSRVBPKSB0aHJvdyBuZXcgRXJyb3IoYFJlcG8gcmVxdWlyZWQhLCBidXQgZ290IFwiJHtSRVBPfVwiYCk7XG5cdGlmICghZXhpc3RzU3luYyhSRVBPKSkgdGhyb3cgbmV3IEVycm9yKGBSZXBvIGxvY2F0aW9uIGRvZXMgbm90IGV4aXN0OiBcIiR7UkVQT31cImApO1xuXG5cdGxldCBkZWZhdWx0RXhlY09wdGlvbnM6IFNwYXduU3luY09wdGlvbnMgPSB7XG5cdFx0Y3dkOiBSRVBPLFxuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0fTtcblxuXHQvLyBTZXQgZGVmYXVsdHNcblx0b3B0aW9ucyA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHsgZXhlY09wdGlvbnM6IGRlZmF1bHRFeGVjT3B0aW9ucyB9LCBvcHRpb25zKTtcblx0b3B0aW9ucy5leGVjT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLmV4ZWNPcHRpb25zLCBkZWZhdWx0RXhlY09wdGlvbnMpO1xuXG5cdGlmIChvcHRpb25zLnJldHVybkFsbEZpZWxkcylcblx0e1xuXHRcdG9wdGlvbnMuZmllbGRzID0gW10uY29uY2F0KE9iamVjdC5rZXlzKGZpZWxkcykpO1xuXG5cdFx0aWYgKG9wdGlvbnMubmFtZVN0YXR1cyAmJiB0eXBlb2Ygb3B0aW9ucy5uYW1lU3RhdHVzRmlsZXMgPT0gJ3VuZGVmaW5lZCcpXG5cdFx0e1xuXHRcdFx0b3B0aW9ucy5uYW1lU3RhdHVzRmlsZXMgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb21tYW5kcyhvcHRpb25zOiBJT3B0aW9ucyk6IHtcblx0YmluOiBzdHJpbmcsXG5cdGNvbW1hbmRzOiBJQ29tbWFuZHMsXG59XG57XG5cdC8vIFN0YXJ0IGNvbnN0cnVjdGluZyBjb21tYW5kXG5cblx0bGV0IGJpbiA9ICdnaXQnO1xuXHRsZXQgY29tbWFuZHM6IElDb21tYW5kcyA9IFtcblx0XHQnbG9nJyxcblx0XTtcblxuXHRjb21tYW5kcyA9IGFkZEZsYWdzQm9vbChjb21tYW5kcywgb3B0aW9ucywgW1xuXHRcdCdmaW5kQ29waWVzSGFyZGVyJyxcblx0XHQnYWxsJyxcblx0XSk7XG5cblx0aWYgKG9wdGlvbnMubnVtYmVyID4gMClcblx0e1xuXHRcdGNvbW1hbmRzLnB1c2goJy1uJywgb3B0aW9ucy5udW1iZXIpO1xuXHR9XG5cblx0Y29tbWFuZHMgPSBhZGRGbGFnc0Jvb2woY29tbWFuZHMsIG9wdGlvbnMsIFtcblx0XHQnbm9NZXJnZXMnLFxuXHRcdCdmaXJzdFBhcmVudCcsXG5cdF0pO1xuXG5cdGNvbW1hbmRzID0gYWRkT3B0aW9uYWwoY29tbWFuZHMsIG9wdGlvbnMpO1xuXG5cdHtcblx0XHRjb21tYW5kcyA9IGFkZFByZXR0eUZvcm1hdChjb21tYW5kcywgb3B0aW9ucywgRW51bVByZXR0eUZvcm1hdEZsYWdzLlBSRVRUWSlcblx0fVxuXG5cdC8vIEFwcGVuZCBicmFuY2ggKHJldmlzaW9uIHJhbmdlKSBpZiBzcGVjaWZpZWRcblx0aWYgKG9wdGlvbnMuYnJhbmNoKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaChvcHRpb25zLmJyYW5jaCk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5maWxlKVxuXHR7XG5cdFx0Y29tbWFuZHMucHVzaCgnLS0nLCBvcHRpb25zLmZpbGUpO1xuXG5cdFx0Y29tbWFuZHMgPSBhZGRGbGFnc0Jvb2woY29tbWFuZHMsIG9wdGlvbnMsIFtcblx0XHRcdCdmb2xsb3cnLFxuXHRcdF0pO1xuXHR9XG5cdGVsc2UgaWYgKG9wdGlvbnMuZm9sbG93KVxuXHR7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgb3B0aW9ucy5mb2xsb3cgd29ya3Mgb25seSBmb3IgYSBzaW5nbGUgZmlsZWApXG5cdH1cblxuXHQvL0ZpbGUgYW5kIGZpbGUgc3RhdHVzXG5cdGNvbW1hbmRzID0gYWRkRmxhZ3NCb29sKGNvbW1hbmRzLCBvcHRpb25zLCBbXG5cdFx0J25hbWVTdGF0dXMnLFxuXHRdKTtcblxuXHRjb25zb2xlLmRpcihjb21tYW5kcyk7XG5cblx0ZGVidWcoJ2NvbW1hbmQnLCBvcHRpb25zLmV4ZWNPcHRpb25zLCBjb21tYW5kcyk7XG5cblx0cmV0dXJuIHsgYmluLCBjb21tYW5kcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQcmV0dHlGb3JtYXQoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMsIGZsYWdOYW1lID0gRW51bVByZXR0eUZvcm1hdEZsYWdzLlBSRVRUWSlcbntcblx0Ly8gU3RhcnQgb2YgY3VzdG9tIGZvcm1hdFxuXHQvLyBJdGVyYXRpbmcgdGhyb3VnaCB0aGUgZmllbGRzIGFuZCBhZGRpbmcgdGhlbSB0byB0aGUgY3VzdG9tIGZvcm1hdFxuXHRsZXQgY29tbWFuZCA9IG9wdGlvbnMuZmllbGRzLnJlZHVjZShmdW5jdGlvbiAoY29tbWFuZCwgZmllbGQpXG5cdFx0e1xuXHRcdFx0aWYgKCFmaWVsZHNbZmllbGRdICYmIG5vdE9wdEZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHRocm93IG5ldyBSYW5nZUVycm9yKCdVbmtub3duIGZpZWxkOiAnICsgZmllbGQpO1xuXG5cdFx0XHRjb21tYW5kLnB1c2goRW51bVByZXR0eUZvcm1hdE1hcmsuREVMSU1JVEVSICsgZmllbGRzW2ZpZWxkXSk7XG5cblx0XHRcdHJldHVybiBjb21tYW5kO1xuXHRcdH0sIFtgJHt0b0ZsYWcoZmxhZ05hbWUpfT0ke0VudW1QcmV0dHlGb3JtYXRNYXJrLkJFR0lOfWBdKVxuXHRcdC5jb25jYXQoW0VudW1QcmV0dHlGb3JtYXRNYXJrLkVORF0pXG5cdFx0LmpvaW4oRW51bVByZXR0eUZvcm1hdE1hcmsuSk9JTik7XG5cblx0Y29tbWFuZHMucHVzaChjb21tYW5kKTtcblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShmaWxlOiBzdHJpbmcpOiBzdHJpbmdcbntcblx0aWYgKGZpbGUuaW5kZXhPZignXCInKSA9PSAwIHx8IGZpbGUubWF0Y2goLyg/OlxcXFwoXFxkezN9KSkvKSlcblx0e1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoL15cInxcIiQvZywgJycpO1xuXG5cdFx0ZmlsZSA9IF9kZWNvZGUoZmlsZSk7XG5cdH1cblxuXHRyZXR1cm4gZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2FtZWxpemUoa2V5OiBzdHJpbmcpOiBzdHJpbmdcbntcblx0cmV0dXJuIF9kZWNhbWVsaXplKGtleSwgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GbGFnKGtleTogc3RyaW5nKVxue1xuXHRyZXR1cm4gJy0tJyArIGRlY2FtZWxpemUoa2V5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZsYWdzQm9vbChjb21tYW5kczogSUNvbW1hbmRzLCBvcHRpb25zOiBJT3B0aW9ucywgZmxhZ05hbWVzOiBzdHJpbmdbXSlcbntcblx0Zm9yIChsZXQgayBvZiBmbGFnTmFtZXMpXG5cdHtcblx0XHRpZiAob3B0aW9uc1trXSlcblx0XHR7XG5cdFx0XHRjb21tYW5kcy5wdXNoKHRvRmxhZyhrKSlcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuLyoqKlxuIEFkZCBvcHRpb25hbCBwYXJhbWV0ZXIgdG8gY29tbWFuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkT3B0aW9uYWwoY29tbWFuZHM6IElDb21tYW5kcywgb3B0aW9uczogSU9wdGlvbnMpXG57XG5cdGxldCBjbWRPcHRpb25hbCA9IFsnYXV0aG9yJywgJ3NpbmNlJywgJ2FmdGVyJywgJ3VudGlsJywgJ2JlZm9yZScsICdjb21taXR0ZXInXVxuXHRmb3IgKGxldCBrIG9mIGNtZE9wdGlvbmFsKVxuXHR7XG5cdFx0aWYgKG9wdGlvbnNba10pXG5cdFx0e1xuXHRcdFx0Y29tbWFuZHMucHVzaChgLS0ke2t9PSR7b3B0aW9uc1trXX1gKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gY29tbWFuZHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWl0RmllbGRzKHBhcnNlZDogSVBhcnNlQ29tbWl0LCBjb21taXRGaWVsZDogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBmaWVsZHM6IElGaWVsZHNBcnJheSlcbntcblx0bGV0IGtleSA9IGZpZWxkc1tpbmRleF07XG5cblx0c3dpdGNoIChrZXkpXG5cdHtcblx0XHRjYXNlICd0YWdzJzpcblx0XHRcdGxldCB0YWdzID0gW107XG5cdFx0XHRsZXQgc3RhcnQgPSBjb21taXRGaWVsZC5pbmRleE9mKCd0YWc6ICcpO1xuXHRcdFx0aWYgKHN0YXJ0ID49IDApXG5cdFx0XHR7XG5cdFx0XHRcdGNvbW1pdEZpZWxkXG5cdFx0XHRcdFx0LnN1YnN0cihzdGFydCArIDUpXG5cdFx0XHRcdFx0LnRyaW0oKVxuXHRcdFx0XHRcdC5zcGxpdCgnLCcpXG5cdFx0XHRcdFx0LmZvckVhY2goZnVuY3Rpb24gKHRhZylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWdzLnB1c2godGFnLnRyaW0oKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXHRcdFx0fVxuXHRcdFx0cGFyc2VkW2tleV0gPSB0YWdzO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnYXV0aG9yRGF0ZVVuaXhUaW1lc3RhbXAnOlxuXHRcdGNhc2UgJ2NvbW1pdHRlckRhdGVVbml4VGltZXN0YW1wJzpcblx0XHRcdHBhcnNlZFtrZXldID0gcGFyc2VJbnQoY29tbWl0RmllbGQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHBhcnNlZFtrZXldID0gY29tbWl0RmllbGQ7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBwYXJzZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbW1pdHMoY29tbWl0czogc3RyaW5nW10sIG9wdGlvbnM6IElPcHRpb25zKTogSVJldHVybkNvbW1pdHNcbntcblx0bGV0IHsgZmllbGRzLCBuYW1lU3RhdHVzIH0gPSBvcHRpb25zO1xuXG5cdHJldHVybiBjb21taXRzLm1hcChmdW5jdGlvbiAoX2NvbW1pdClcblx0e1xuXHRcdGxldCBwYXJ0cyA9IF9jb21taXQuc3BsaXQoRW51bVByZXR0eUZvcm1hdE1hcmsuRU5EKTtcblxuXHRcdGxldCBjb21taXQgPSBwYXJ0c1swXS5zcGxpdChkZWxpbWl0ZXIpO1xuXG5cdFx0bGV0IG5hbWVTdGF0dXNGaWxlczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG5cblx0XHRpZiAocGFydHNbMV0pXG5cdFx0e1xuXHRcdFx0bGV0IHBhcnNlTmFtZVN0YXR1cyA9IHBhcnRzWzFdLnRyaW1MZWZ0KCkuc3BsaXQoTEYpO1xuXG5cdFx0XHQvLyBSZW1vdmVzIGxhc3QgZW1wdHkgY2hhciBpZiBleGlzdHNcblx0XHRcdGlmIChwYXJzZU5hbWVTdGF0dXNbcGFyc2VOYW1lU3RhdHVzLmxlbmd0aCAtIDFdID09PSAnJylcblx0XHRcdHtcblx0XHRcdFx0cGFyc2VOYW1lU3RhdHVzLnBvcCgpXG5cdFx0XHR9XG5cblx0XHRcdHBhcnNlTmFtZVN0YXR1cyA9IHBhcnNlTmFtZVN0YXR1c1xuXHRcdFx0Ly8gU3BsaXQgZWFjaCBsaW5lIGludG8gaXQncyBvd24gZGVsaW1pdGVyZWQgYXJyYXlcblx0XHRcdFx0Lm1hcChmdW5jdGlvbiAoZCwgaSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBkLnNwbGl0KGRlbGltaXRlcik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vIDAgd2lsbCBhbHdheXMgYmUgc3RhdHVzLCBsYXN0IHdpbGwgYmUgdGhlIGZpbGVuYW1lIGFzIGl0IGlzIGluIHRoZSBjb21taXQsXG5cdFx0XHRcdC8vIGFueXRoaW5nIGluYmV0d2VlbiBjb3VsZCBiZSB0aGUgb2xkIG5hbWUgaWYgcmVuYW1lZCBvciBjb3BpZWRcblx0XHRcdFx0LnJlZHVjZShmdW5jdGlvbiAoYSwgYilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCB0ZW1wQXJyID0gW2JbMF0sIGJbYi5sZW5ndGggLSAxXV07XG5cblx0XHRcdFx0XHR0ZW1wQXJyWzFdID0gZGVjb2RlKHRlbXBBcnJbMV0pO1xuXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdG5hbWVTdGF0dXNGaWxlcy5wdXNoKHRlbXBBcnIpO1xuXG5cdFx0XHRcdFx0Ly8gSWYgYW55IGZpbGVzIGluIGJldHdlZW4gbG9vcCB0aHJvdWdoIHRoZW1cblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMSwgbGVuID0gYi5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly8gSWYgc3RhdHVzIFIgdGhlbiBhZGQgdGhlIG9sZCBmaWxlbmFtZSBhcyBhIGRlbGV0ZWQgZmlsZSArIHN0YXR1c1xuXHRcdFx0XHRcdFx0Ly8gT3RoZXIgcG90ZW50aWFscyBhcmUgQyBmb3IgY29waWVkIGJ1dCB0aGlzIHdvdWxkbid0IHJlcXVpcmUgdGhlIG9yaWdpbmFsIGRlbGV0aW5nXG5cdFx0XHRcdFx0XHRpZiAoYlswXS5zbGljZSgwLCAxKSA9PT0gJ1InKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZW1wQXJyLnB1c2goJ0QnLCBiW2ldKTtcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRuYW1lU3RhdHVzRmlsZXMucHVzaChbJ0QnLCBkZWNvZGUoYltpXSldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gYS5jb25jYXQodGVtcEFycik7XG5cdFx0XHRcdH0sIFtdKVxuXHRcdFx0O1xuXG5cdFx0XHRjb21taXQgPSBjb21taXQuY29uY2F0KHBhcnNlTmFtZVN0YXR1cylcblx0XHR9XG5cblx0XHRkZWJ1ZygnY29tbWl0JywgY29tbWl0KVxuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBmaXJzdCBlbXB0eSBjaGFyIGZyb20gdGhlIGFycmF5XG5cdFx0Y29tbWl0LnNoaWZ0KClcblxuXHRcdGxldCBwYXJzZWQ6IElQYXJzZUNvbW1pdCA9IHt9XG5cblx0XHRpZiAobmFtZVN0YXR1cylcblx0XHR7XG5cdFx0XHQvLyBDcmVhdGUgYXJyYXlzIGZvciBub24gb3B0aW9uYWwgZmllbGRzIGlmIHR1cm5lZCBvblxuXHRcdFx0bm90T3B0RmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGQpXG5cdFx0XHR7XG5cdFx0XHRcdHBhcnNlZFtkXSA9IFtdO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRjb21taXQuZm9yRWFjaChmdW5jdGlvbiAoY29tbWl0RmllbGQsIGluZGV4KVxuXHRcdHtcblx0XHRcdGlmIChmaWVsZHNbaW5kZXhdKVxuXHRcdFx0e1xuXHRcdFx0XHRwYXJzZWQgPSBwYXJzZUNvbW1pdEZpZWxkcyhwYXJzZWQsIGNvbW1pdEZpZWxkLCBpbmRleCwgZmllbGRzKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aWYgKG5hbWVTdGF0dXMpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgcG9zID0gKGluZGV4IC0gZmllbGRzLmxlbmd0aCkgJSBub3RPcHRGaWVsZHMubGVuZ3RoXG5cblx0XHRcdFx0XHRkZWJ1ZygnbmFtZVN0YXR1cycsIChpbmRleCAtIGZpZWxkcy5sZW5ndGgpLCBub3RPcHRGaWVsZHMubGVuZ3RoLCBwb3MsIGNvbW1pdEZpZWxkKVxuXHRcdFx0XHRcdHBhcnNlZFtub3RPcHRGaWVsZHNbcG9zXV0ucHVzaChjb21taXRGaWVsZClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKG5hbWVTdGF0dXMgJiYgb3B0aW9ucy5uYW1lU3RhdHVzRmlsZXMpXG5cdFx0e1xuXHRcdFx0cGFyc2VkLmZpbGVTdGF0dXMgPSBhcnJheV91bmlxdWUobmFtZVN0YXR1c0ZpbGVzKSBhcyB0eXBlb2YgbmFtZVN0YXR1c0ZpbGVzO1xuXHRcdH1cblxuXHRcdHBhcnNlZCA9IHNvcnRPYmplY3RLZXlzKHBhcnNlZCwgS0VZX09SREVSKTtcblxuXHRcdHJldHVybiBwYXJzZWRcblx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tbWl0c1N0ZG91dChvcHRpb25zOiBJT3B0aW9ucywgc3Rkb3V0OiBCdWZmZXIpXG57XG5cdGxldCBzdHI6IHN0cmluZztcblxuXHRkZWJ1Zygnc3Rkb3V0Jywgc3Rkb3V0KTtcblxuXHRpZiAob3B0aW9ucy5mbkhhbmRsZUJ1ZmZlcilcblx0e1xuXHRcdHN0ciA9IG9wdGlvbnMuZm5IYW5kbGVCdWZmZXIoc3Rkb3V0KVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHN0ciA9IHN0ZG91dC50b1N0cmluZygpXG5cdH1cblxuXHQvL2NvbnNvbGUubG9nKHN0cik7XG5cblx0bGV0IGNvbW1pdHMgPSBzdHIuc3BsaXQoRW51bVByZXR0eUZvcm1hdE1hcmsuQkVHSU4pIGFzIElSZXR1cm5Db21taXRzO1xuXHRpZiAoY29tbWl0c1swXSA9PT0gJycpXG5cdHtcblx0XHRjb21taXRzLnNoaWZ0KClcblx0fVxuXHRkZWJ1ZygnY29tbWl0cycsIGNvbW1pdHMpO1xuXG5cdGNvbW1pdHMgPSBwYXJzZUNvbW1pdHMoY29tbWl0cyBhcyBzdHJpbmdbXSwgb3B0aW9ucyk7XG5cblx0ZGVidWcoJ2NvbW1pdHM6cGFyc2VkJywgY29tbWl0cyk7XG5cblx0cmV0dXJuIGNvbW1pdHM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFzeW5jQ2FsbGJhY2tcbntcblx0KGVycm9yLCBjb21taXRzOiBJUmV0dXJuQ29tbWl0cyk6IHZvaWRcbn1cblxuLy8gQHRzLWlnbm9yZVxuT2JqZWN0LmZyZWV6ZShleHBvcnRzKTtcbiJdfQ==