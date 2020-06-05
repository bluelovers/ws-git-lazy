import { handlePrefix } from '../lib/util';

describe(`prefix`, () =>
{

	[
		`./node-novel-info`,
		`.\\node-novel-info`,

		`../node-novel-info`,
		`..\\node-novel-info`,

		`packages/node-novel-info`,
		`packages\\node-novel-info`,


		`//node-novel-info`,
		`\\\\node-novel-info`,

		`/node-novel-info`,
		`\\node-novel-info`,
	]
		.forEach(prefix =>
		{
			test(prefix, () =>
			{

				let actual = handlePrefix(prefix);
				let expected;

				expect(actual).toMatchSnapshot();

			});
		})
	;

})
