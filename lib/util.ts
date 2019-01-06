/**
 * Created by user on 2019/1/6/006.
 */

import { array_unique } from 'array-hyper-unique';
import debug0 from 'debug';
import { existsSync } from "fs";
import { decode as _decode } from 'git-decode';
import {
	defaultOptions,
	delimiter,
	fields,
	ICommands,
	IOptions,
	IParseCommit,
	IReturnCommits,
	KEY_ORDER,
	notOptFields,
} from './type';
import extend = require('lodash.assign');
import sortObjectKeys = require('sort-object-keys2');

export const debug = debug0('gitlog');

export function handleOptions(options: IOptions)
{
	// lazy name
	const REPO = typeof options.repo != 'undefined' ? options.repo : options.cwd;

	if (!REPO) throw new Error(`Repo required!, but got "${REPO}"`);
	if (!existsSync(REPO)) throw new Error(`Repo location does not exist: "${REPO}"`);

	let defaultExecOptions = { cwd: REPO };

	// Set defaults
	options = extend({}, defaultOptions, { execOptions: defaultExecOptions }, options);
	options.execOptions = extend(options.execOptions, defaultExecOptions);

	if (options.returnAllFields)
	{
		options.fields = [].concat(Object.keys(fields));

		if (options.nameStatus && typeof options.nameStatusFiles == 'undefined')
		{
			options.nameStatusFiles = true;
		}
	}

	return options;
}

export function buildCommands(options: IOptions): {
	bin: string,
	commands: ICommands,
}
{
	// Start constructing command

	let bin = 'git';
	let commands: ICommands = [
		'log',
	];

	if (options.findCopiesHarder)
	{
		commands.push('--find-copies-harder');
	}

	if (options.all)
	{
		commands.push('--all');
	}

	if (options.number > 0)
	{
		commands.push('-n', options.number);
	}

	if (options.noMerges)
	{
		commands.push('--no-merges');
	}

	if (options.firstParent)
	{
		commands.push('--first-parent');
	}

	commands = addOptional(commands, options);

	{
		// Start of custom format
		// Iterating through the fields and adding them to the custom format
		let command = options.fields.reduce(function (command, field)
		{
			if (!fields[field] && notOptFields.indexOf(field) === -1) throw new Error('Unknown field: ' + field)
			command += delimiter + fields[field]

			return command;
		}, '--pretty=@begin@') + '@end@';

		commands.push(command);
	}

	// Append branch (revision range) if specified
	if (options.branch)
	{
		commands.push(options.branch);
	}

	if (options.file)
	{
		commands.push('--', options.file);
	}

	//File and file status
	if (options.nameStatus)
	{
		commands.push('--name-status');
	}

	debug('command', options.execOptions, commands);

	return { bin, commands }
}

export function decode(file: string): string
{
	if (file.indexOf('"') == 0 || file.match(/(?:\\(\d{3}))/))
	{
		file = file.replace(/^"|"$/g, '');

		file = _decode(file);
	}

	return file;
}

/***
 Add optional parameter to command
 */
export function addOptional(commands: ICommands, options: IOptions)
{
	let cmdOptional = ['author', 'since', 'after', 'until', 'before', 'committer']
	for (let i = cmdOptional.length; i--;)
	{
		if (options[cmdOptional[i]])
		{
			commands.push(`--${cmdOptional[i]}="${options[cmdOptional[i]]}"`)
		}
	}
	return commands
}

export function parseCommits(commits: string[], options: IOptions): IReturnCommits
{
	let { fields, nameStatus } = options;

	return commits.map(function (_commit)
	{
		let parts = _commit.split('@end@')

		let commit = parts[0].split(delimiter);

		let nameStatusFiles: [string, string][] = [];

		if (parts[1])
		{
			let parseNameStatus = parts[1].trimLeft().split('\n');

			// Removes last empty char if exists
			if (parseNameStatus[parseNameStatus.length - 1] === '')
			{
				parseNameStatus.pop()
			}

			parseNameStatus = parseNameStatus
			// Split each line into it's own delimitered array
				.map(function (d, i)
				{
					return d.split(delimiter);
				})
				// 0 will always be status, last will be the filename as it is in the commit,
				// anything inbetween could be the old name if renamed or copied
				.reduce(function (a, b)
				{
					let tempArr = [b[0], b[b.length - 1]];

					tempArr[1] = decode(tempArr[1]);

					// @ts-ignore
					nameStatusFiles.push(tempArr);

					// If any files in between loop through them
					for (let i = 1, len = b.length - 1; i < len; i++)
					{
						// If status R then add the old filename as a deleted file + status
						// Other potentials are C for copied but this wouldn't require the original deleting
						if (b[0].slice(0, 1) === 'R')
						{
							tempArr.push('D', b[i]);
							// @ts-ignore
							nameStatusFiles.push(['D', decode(b[i])]);
						}
					}

					return a.concat(tempArr);
				}, [])
			;

			commit = commit.concat(parseNameStatus)
		}

		debug('commit', commit)

		// Remove the first empty char from the array
		commit.shift()

		let parsed: IParseCommit = {}

		if (nameStatus)
		{
			// Create arrays for non optional fields if turned on
			notOptFields.forEach(function (d)
			{
				parsed[d] = [];
			})
		}

		commit.forEach(function (commitField, index)
		{
			if (fields[index])
			{
				if (fields[index] === 'tags')
				{
					let tags = [];
					let start = commitField.indexOf('tag: ');
					if (start >= 0)
					{
						commitField.substr(start + 5).trim().split(',').forEach(function (tag)
						{
							tags.push(tag.trim());
						});
					}
					parsed[fields[index]] = tags;
				}
				else
				{
					parsed[fields[index]] = commitField
				}
			}
			else
			{
				if (nameStatus)
				{
					let pos = (index - fields.length) % notOptFields.length

					debug('nameStatus', (index - fields.length), notOptFields.length, pos, commitField)
					parsed[notOptFields[pos]].push(commitField)
				}
			}
		})

		if (nameStatus && options.nameStatusFiles)
		{
			parsed.fileStatus = array_unique(nameStatusFiles) as typeof nameStatusFiles;
		}

		parsed = sortObjectKeys(parsed, KEY_ORDER);

		return parsed
	})
}

export function parseCommitsStdout(options: IOptions, stdout: Buffer)
{
	let str: string;

	debug('stdout', stdout);

	if (options.fnHandleBuffer)
	{
		str = options.fnHandleBuffer(stdout)
	}
	else
	{
		str = stdout.toString()
	}

	let commits = str.split('@begin@') as IReturnCommits;
	if (commits[0] === '')
	{
		commits.shift()
	}
	debug('commits', commits);

	commits = parseCommits(commits as string[], options);

	debug('commits:parsed', commits);

	return commits;
}

export interface IAsyncCallback
{
	(error, commits: IReturnCommits): void
}

// @ts-ignore
Object.freeze(exports);
