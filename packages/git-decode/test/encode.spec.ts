import { decode, encode, decode2 } from '../index';
import { wrapQuote, removeQuote, isQuote } from '../lib/util';

const map = [
	[
		['\\351\\255\\224\\347\\245\\236\\350\\273\\242\\347\\224\\2372.CT'],
		'魔神転生2.CT',
	],
	[
		['66\\351\\255\\22477\\347\\245\\236\\350\\273\\242\\347\\224\\2372.CT'],
		'66魔77神転生2.CT',
	],
	[
		['"66\\351\\255\\22477\\347\\245\\236\\350\\273\\242\\347\\224\\2372.CT"'],
		'"66魔77神転生2.CT"',
	],
	[
		['\\302\\201'],
		String.fromCharCode(0x81),
	],
	[
		['\\351\\255\\224\\347\\245\\236\\350\\273\\242\\347\\224\\237'],
		'魔神転生',
	],
	[
		['\\302\\201\\351\\255\\224\\347\\245\\236\\350\\273\\242\\347\\224\\237'],
		String.fromCharCode(0x81) + '魔神転生',
	],
	[
		['\\351\\255\\224\\347\\245\\236\\350\\273\\242\\347\\224\\237\\302\\201'],
		'魔神転生' + String.fromCharCode(0x81),
	],
	[
		['999 \\346\\226\\260\\346\\226\\207\\345\\255\\227\\346\\226\\207\\177\\344\\273\\266.TXT'],
		'999 新文字文件.TXT',
	],
	[
		['999 { }  \' ~.TXT'],
		'999 { }  \' ~.TXT',
	],
	[
		['\\177'],
		'',
	],
	[
		['2\\177'],
		'2',
	],
	[
		['\\177.'],
		'.',
	],
	[
		['\\342\\230\\272'],
		'☺',
	],
	[
		['999 \\346\\265\\205\\350\\260\\210 JS \\357\\274\\241\\357\\274\\242 \\345\\257\\271\\350\\261\\241\\344\\271\\213\\346\\211\\251\\345\\261\\225.TXT'],
		'999 浅谈 JS ＡＢ 对象之扩展.TXT',
	],
] as [[string], string][];

describe(`decode`, () =>
{

	map.forEach(function (v)
		{
			test(`${v[1]} = ${v[0][0]}`, () =>
				{
					let actual = decode(...v[0]);
					expect(actual).toStrictEqual(v[1]);
					expect(actual).toMatchSnapshot();
				},
			);
		},
	)

})

describe('encode', function ()
	{
		map.forEach(function (v)
			{
				it(`${v[1]} = ${v[0][0]}`, () =>
					{
						let actual = encode(v[1]);
						expect(actual).toStrictEqual(v[0][0]);
						expect(actual).toMatchSnapshot();
					},
				);
			},
		)
	},
);

describe('encode = decode', function ()
	{
		map.forEach(function (v)
			{
				it(`${v[1]} = ${v[0][0]}`, () =>
					{
						let actual = decode(v[0][0]);

						expect(actual).toStrictEqual(decode(encode(actual)));
						expect(actual).toStrictEqual(v[1]);

						actual = encode(v[1]);

						expect(actual).toStrictEqual(encode(decode(actual)));
						expect(actual).toStrictEqual(v[0][0]);
					},
				);
			},
		)
	},
);

describe(`decode2`, () =>
{

	map.forEach(function (v)
		{
			let s = wrapQuote(`${v[0][0]}`, '\'')
			let expected = removeQuote(v[1]);

			test(`${expected} = ${s}`, () =>
				{
					let actual = decode2(s);
					expect(actual).toStrictEqual(expected);
					expect(isQuote(actual)).toStrictEqual(false);
					expect(actual).toMatchSnapshot();
				},
			);

			let s2 = wrapQuote(`${v[0][0]}`)

			test(`${expected} = ${s2}`, () =>
				{
					let actual = decode2(s2);
					expect(actual).toStrictEqual(expected);
					expect(isQuote(actual)).toStrictEqual(false);
					expect(actual).toMatchSnapshot();
				},
			);
		},
	)

})
