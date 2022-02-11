import { merge } from '@src/merge';

describe('merge objects', () => {
	test('merges object "first" with object "second"', () => {
		const first = {
			nested: {
				array: ['A'],
				value: 1,
			},
		};

		const second = {
			nested: {
				array: ['B'],
				value2: 2,
			},
		};

		const output = merge(first, second);

		expect(output).toEqual({
			nested: { value: 1, value2: 2, array: ['A', 'B'] },
		});
	});
});
