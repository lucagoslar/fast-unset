import { clone } from '@src/clone';

describe('cloned object equals original object', () => {
	test('deep clones the object', () => {
		const object = {
			name: 'X',
			age: 30,
		};

		const cloned = clone(object) as typeof object;

		object.name = 'Y';

		expect(object.name).not.toEqual(cloned.name);
	});

	test('cloned object does not mutate', () => {
		const object: any = {
			name: {
				forename: undefined,
				surname: 'Y',
			},
			age: 30,
		};

		const cloned = clone(object) as typeof object;

		object.name.forename = 'Y';

		expect(object.name.forename).not.toEqual(cloned.name.forename);
	});

	test('cloned object does not mutate', () => {
		const object = {
			name: {
				dob: new Date(),
				surname: 'Y',
			},
			age: 30,
		};

		const cloned = clone(object) as typeof object;

		object.name.dob.setDate(new Date().getDate() + 1);

		expect(object.name.dob).not.toEqual(cloned.name.dob);
	});

	test('typings of the original obejct and the cloned one match', () => {
		const object = {
			date: new Date(),
			regexp: new RegExp(/abc/),
			array: [1, 2, 3],
			object: {
				a: 1,
				b: 2,
			},
			string: 'abc',
			number: 1,
			boolean: true,
			func: () => 1,
		};

		const cloned = clone(object) as typeof object;

		for (const [key, value] of Object.entries(object) as Array<
			[keyof typeof object, unknown]
		>) {
			if (value && typeof value === 'function') {
				expect((cloned[key] as () => unknown)()).toBe(value());
			} else if (value && typeof value === 'object') {
				expect((value as Record<string, unknown> | Date).constructor).toEqual(
					cloned[key].constructor
				);
			} else {
				expect(value).toEqual(cloned[key]);
			}
		}
	});
});
