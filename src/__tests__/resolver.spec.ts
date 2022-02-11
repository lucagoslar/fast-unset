import { resolver } from '@src/resolver';

describe('merge objects', () => {
	test('path contains property "nested"', () => {
		const modifier = {
			nested: {
				deep: { value: 1 },
			},
		};

		const path = resolver(modifier);

		expect(path).toEqual({
			nested: {},
		});
	});

	test('path contains property "nested"', () => {
		const modifier = {
			nested: {
				rule: [{ deep: { deeper: { value: 1 } } }],
			},
		};

		const path = resolver(modifier);

		expect(path).toEqual({
			nested: { deep: {} },
		});
	});
});
