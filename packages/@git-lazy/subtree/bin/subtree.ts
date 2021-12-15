#!/usr/bin/env node

import yargs, { Argv } from 'yargs';
import { EnumSubtreeCmd, IOptionsCommon, IOptions, IOptionsRuntime, IOptionsSplit } from '..';
import { handleOptions, _cmd, unparseCmd } from '../lib/core';
import logger from 'debug-color2/logger';
import console, { debug } from '@git-lazy/debug';
import unparse from 'yargs-unparser';
import { version } from '../package.json';
import { _cmdSplit, handleOptionsSplit, unparseCmdSplit } from '../lib/core/split';
import yesno from 'yesno';

let cli = yargs
	.option('prefix', {
		alias: ['P'],
		string: true,
		demandOption: true,
	})
	.option('remote', {
		string: true,
	})
	.option('name', {
		string: true,
	})
	.option('branch', {
		alias: ['b'],
		string: true,
	})
	.option('squash', {
		boolean: true,
	})
	.option('cwd', {
		string: true,
		normalize: true,
		default: process.cwd(),
	})
	.option('squash', {
		boolean: true,
	})
	.option('version', {
		alias: ['v'],
		boolean: true,
	})
	.option('help', {
		alias: ['h'],
		boolean: true,
	})
	.option('disableExec', {
		boolean: true,
	})
;

cli = _setup_cmd(cli, EnumSubtreeCmd.add);
cli = _setup_cmd(cli, EnumSubtreeCmd.pull);
cli = _setup_cmd(cli, EnumSubtreeCmd.push);
cli = _setup_cmd(cli, EnumSubtreeCmd.split);

cli
	.strict(false)
	.help()
	.showHelpOnFail(true)
	.version('v')
	.demandCommand()
	.command('$0', '', (yargs) =>
	{

		// @ts-ignore
		if (yargs.argv.help || yargs.argv.h)
		{
			return yargs.showHelp('info')
		}
		// @ts-ignore
		else if (yargs.argv.version || yargs.argv.v)
		{
			return console.log(`${version}`)
		}

		debug.log(yargs.argv);

		yargs.showHelp()
	})
	.parse()
;

function _setup_cmd<Y extends typeof cli>(yargs: Y, cmd: EnumSubtreeCmd): Y
{
	let aliases: string[] = [cmd];

	if (cmd === EnumSubtreeCmd.add)
	{
		aliases = [cmd, 'clone', 'init'];
	}

	aliases.map(cmd => `${cmd} [remote] [branch]`)

	yargs
		.command(aliases, ``, (yargs) =>
		{

			if (cmd === EnumSubtreeCmd.split)
			{
				yargs = yargs
					.option('rejoin', {
						boolean: true,
					})
					.option('ignoreJoins', {
						boolean: true,
					})
				;
			}

			let argv = yargs.parseSync();

			if (argv.help || argv.h)
			{
				return yargs.showHelp()
			}
			else if (argv.version || argv.v)
			{
				return console.log(`${version}`)
			}

			return _builder(cmd, yargs)
		})
	;

	return yargs
}

async function _builder(cmd: EnumSubtreeCmd, yargs: typeof cli)
{
	const argv = yargs.parseSync();

	let { remote, branch, prefix, cwd, name, _, $0, disableExec, ...args_plus } = argv;

	_ = _.slice(1);

	if (cmd !== EnumSubtreeCmd.split)
	{
		// @ts-ignore
		remote = remote ?? name ?? _.shift();
	}

	// @ts-ignore
	branch = branch ?? _.shift();

	delete args_plus.P;
	delete args_plus.h;
	delete args_plus.v;
	delete args_plus.b;
	delete args_plus.disableExec;
	delete args_plus['disable-exec'];

	let options: IOptions = {
		...args_plus,

		cwd,

		remote,
		name,

		branch,

		prefix,
	}

	debug.log(options);

	let opts: IOptionsRuntime | IOptionsRuntime<IOptionsSplit>;
	let command: string;

	if (cmd === EnumSubtreeCmd.split)
	{
		opts = handleOptionsSplit(options as IOptionsSplit)

		command = `git ${unparseCmdSplit(cmd, opts).join(' ')}`;
	}
	else
	{
		opts = handleOptions(options as IOptionsCommon)

		// @ts-ignore
		command = `git ${unparseCmd(cmd, opts).join(' ')}`;
	}

	if (argv.disableExec)
	{
		console.log(command)
	}
	else
	{
		logger.debug(`[GIT]`, opts.root);
		logger.debug(`[CWD]`, opts.cwd);
		logger.debug(command);

		if (cmd === EnumSubtreeCmd.split)
		{
			if (!opts.branch)
			{
				const ok = await yesno({
					question: 'Are you sure you want to continue with no branch?',
				});

				if (!ok)
				{
					return yargs.exit(1, new Error(`user cancel`))
				}
			}
			else if (opts.branch === 'master')
			{
				const ok = await yesno({
					question: `Are you sure you want to continue with branch => ${opts.branch}?`,
				});

				if (!ok)
				{
					return yargs.exit(1, new Error(`user cancel`))
				}
			}

			_cmdSplit(cmd, opts as IOptionsRuntime<IOptionsSplit>)
		}
		else
		{
			_cmd(cmd, opts as IOptionsRuntime)
		}
	}
}
