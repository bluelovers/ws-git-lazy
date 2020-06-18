import shell from 'shelljs';
import gitDummyCommit from '../index';

shell.config.silent = true;

shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
shell.exec('git init');

test('Create dummy commits', () => {
	gitDummyCommit('awesome commit');
	expect(shell.exec('git log').stdout.match(/\sawesome commit\s/)).toBeTruthy();

	gitDummyCommit();
	expect(shell.exec('git log').stdout.match(/\sTest commit\s/)).toBeTruthy();

	gitDummyCommit([]);
	expect(shell.exec('git log').stdout.match(/\sTest commit[\w\W]*Test commit\s/)).toBeTruthy();

	gitDummyCommit('     ');
	expect(shell
		.exec('git log')
		.stdout.match(/\sTest commit[\w\W]*Test commit[\w\W]*Test commit\s/)).toBeTruthy();

	gitDummyCommit('');
	expect(shell
		.exec('git log')
		.stdout.match(
			/\sTest commit[\w\W]*Test commit[\w\W]*Test commit[\w\W]*Test commit\s/
		)).toBeTruthy();

	gitDummyCommit(['unicorns', 'rainbows']);
	expect(shell.exec('git log').stdout.match(/\sunicorns\s/)).toBeTruthy();
	expect(shell.exec('git log').stdout.match(/\srainbows\s/)).toBeTruthy();

	gitDummyCommit([' ', 'balloons']);
	expect(shell
		.exec('git log')
		.stdout.match(
			/Test commit[\w\W]*Test commit[\w\W]*Test commit[\w\W]*Test commit[\w\W]*Test commit\s/
		)).toBeTruthy();
	expect(shell.exec('git log').stdout.match(/\sballoons\s/)).toBeTruthy();

	gitDummyCommit('";touch a;"');
	expect(shell.exec('git log').stdout.match(/";touch a;"/)).toBeTruthy();
});
