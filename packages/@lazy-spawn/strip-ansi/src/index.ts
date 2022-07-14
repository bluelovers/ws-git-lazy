import _stripAnsi from 'strip-ansi';
import _hasAnsi from 'has-ansi';

export function stripAnsiValue(input: Buffer, toStr: true): string
export function stripAnsiValue(input: Buffer, toStr?: boolean): Buffer
export function stripAnsiValue(input: string, toStr?: boolean): string
export function stripAnsiValue<T>(input: T, toStr: true): string
export function stripAnsiValue<T>(input: T, toStr?: boolean): T
export function stripAnsiValue(input: string | Buffer, toStr?: boolean)
{
	if (!input)
	{
		return input;
	}

	let isBuffer = typeof input !== 'string';

	let output = input.toString();
	output = _stripAnsi(output);

	if (isBuffer && !toStr)
	{
		if (_hasAnsi(output))
		{
			return Buffer.from(output);
		}

		return input;
	}

	return output;
}

export default stripAnsiValue
