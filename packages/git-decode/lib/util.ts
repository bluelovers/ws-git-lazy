/**
 * Created by user on 2020/6/4.
 */

export function isQuote(input: string)
{
	return /^(["'])(.+)\1$/g.test(input)
}

export function removeQuote(input: string)
{
	return input.replace(/^(["'])(.+)\1$/g, '$2')
}

export function wrapQuote(input: string, quote = '"')
{
	if (!isQuote(input))
	{
		return `${quote}${input}${quote}`
	}

	return input
}
