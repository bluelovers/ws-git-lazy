//@noUnusedParameters:false

import { resolve } from 'path';
import { parseRebaseTodo } from '../src';

beforeAll(async () =>
{

});

test(`parseRebaseTodo`, () =>
{
	const file = resolve(__dirname, './file/git-rebase-todo.txt');

	let actual = parseRebaseTodo(file);

	expect(actual).toMatchSnapshot();

});
