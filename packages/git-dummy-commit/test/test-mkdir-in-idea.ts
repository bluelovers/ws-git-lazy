/**
 * Created by user on 2020/6/19.
 */

import { join } from 'path';
import { remove, pathExists, mkdir, pathExistsSync } from 'fs-extra';
import shell from 'shelljs';
import crossSpawnGitAsync, { crossSpawnGitSync } from '@git-lazy/spawn';

(async () => {

	let dir = 'tmp9';

	shell.cd(__dirname);
	shell.rm('-rf', dir);
	shell.mkdir(dir);
	shell.cd(dir);
	shell.exec('git init');
	shell.rm('-rf', '.git');
	shell.cd(__dirname);
	shell.rm('-rf', dir);

	console.log(`shelljs`, !pathExistsSync(join(__dirname, dir)))
})()
	.catch(e => console.error(`shelljs`, e))
;

let dir = join(__dirname, 'tmp10');

removeDir(dir)
	.then(async () => {
		await mkdir(dir)

		await crossSpawnGitAsync('git', [
			'init',
		], {
			cwd: dir,
			stdio: 'inherit',
		})

		await removeDir(join(dir, '.git'))

		console.log(`fs-extra`, await removeDir(dir))

		if (await pathExists(join(dir, '.git')))
		{
			return Promise.reject(false)
		}
	})
	.catch(e => console.error(`fs-extra`, e))
;

function removeDir(target: string)
{
	return remove(target)
		.catch(async (err) => {
			if (await pathExists(target))
			{
				return Promise.reject(err)
			}
		})
		.then(r => {
			return pathExists(target).then(v => !v)
		})
		.finally(async () => {
			if (await pathExists(target))
			{
				return Promise.reject(false)
			}
		})
	;
}
