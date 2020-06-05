#!/usr/bin/env node

import yargs, { Argv } from 'yargs';
import { EnumSubtreeCmd, IOptions } from '..';
import { _call, handleOptions, _cmd } from '../lib/core';
import logger from 'debug-color2/logger';
import console, { debug } from '@git-lazy/debug';
import unparse from 'yargs-unparser';
import { version } from '../package.json';

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

cli
	.strict(false)
	.help()
	.showHelpOnFail(true)
	.version('v')
	.demandCommand()
	.command('$0', '', (yargs) => {

		if (yargs.argv.help || yargs.argv.h)
		{
			return yargs.showHelp('info')
		}
		else if (yargs.argv.version || yargs.argv.v)
		{
			return console.log(`${version}`)
		}

		debug.log(yargs.argv);

		yargs.showHelp()
	})
	.argv
;

function _setup_cmd<Y extends Argv<any>>(yargs: Y, cmd: EnumSubtreeCmd): Y
{
	let aliases: string[] = [cmd];

	if (cmd === EnumSubtreeCmd.add)
	{
		aliases = [cmd, 'clone', 'init'];
	}

	aliases.map(cmd => `${cmd} [remote] [branch]`)

	yargs
		.command(aliases, ``, (yargs: typeof cli) => {

			if (yargs.argv.help || yargs.argv.h)
			{
				return yargs.showHelp()
			}
			else if (yargs.argv.version || yargs.argv.v)
			{
				return console.log(`${version}`)
			}

			return _builder(cmd, yargs)
		})
	;

	return yargs
}

function _builder(cmd: EnumSubtreeCmd, yargs: typeof cli)
{
	const argv = yargs.argv;

	let { remote, branch, prefix, cwd, name, _, $0, disableExec, ...args_plus } = argv;

	_ = _.slice(1);

	remote = remote ?? name ?? _.shift();
	branch = branch ?? _.shift();

	let options: IOptions = {
		...args_plus,

		cwd,

		remote,
		name,

		branch,

		prefix,
	}

	debug.log(options);

	const opts = handleOptions(options)

	const command = `git ${cmd} ${unparse({
		...args_plus,
		_: [opts.remote, opts.branch],
		prefix: opts.prefix,
	}).join(' ')}`;

	if (argv.disableExec)
	{
		console.log(command)
	}
	else
	{
		logger.debug(`[GIT]`, opts.root);
		logger.debug(`[CWD]`, opts.cwd);
		logger.debug(command);
		_cmd(cmd, opts)
	}
}
