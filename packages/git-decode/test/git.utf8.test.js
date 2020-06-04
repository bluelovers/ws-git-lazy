/**
 * Created by user on 2017/2/24.
 */

'use strict';

const local_dev = require('./_local-dev');
const GitUtil = require('..');

describe(path_relative(__filename), function ()
	{
		let map = [
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
		];

		describe('decode', function ()
			{
				const fn = GitUtil[this.title];

				map.forEach(function (v)
					{
						it(`${v[1]} = ${v[0][0]}`, () =>
							{
								expect(fn.apply(null, v[0])).to.equal(v[1]);
							}
						);
					}
				)
			}
		);

		describe('encode', function ()
			{
				const fn = GitUtil[this.title];

				map.forEach(function (v)
					{
						it(`${v[1]} = ${v[0][0]}`, () =>
							{
								expect(fn(v[1])).to.equal(v[0][0]);
							}
						);
					}
				)
			}
		);

		describe('encode = decode', function ()
			{
				map.forEach(function (v)
					{
						it(`${v[1]} = ${v[0][0]}`, () =>
							{
								let r1 = GitUtil.decode(v[0][0]);
								assert.equal(r1, GitUtil.decode(GitUtil.encode(r1)));

								assert.equal(r1, v[1]);

								let r2 = GitUtil.encode(v[1]);
								assert.equal(r2, GitUtil.encode(GitUtil.decode(r2)));

								assert.equal(r2, v[0][0]);
							}
						);
					}
				)
			}
		);
	}
);
