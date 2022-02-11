import funset from '@src/index';

describe('removing properties', () => {
	test('removes property "name"', () => {
		const object = {
			name: 'X',
		};

		funset(object, { name: null });

		expect(object).toEqual({});
	});

	test('removes property "name"', () => {
		const object = {
			name: 'X',
			additional: false,
		};

		funset(object, { name: null });

		expect(object).toEqual({ additional: false });
	});

	test('removes property "name"', () => {
		const object = {
			name: 'X',
		};

		funset(object, { name: { rule: null } });

		expect(object).toEqual({});
	});

	test('remove property "name" of property "name"', () => {
		const object = {
			name: { name: 'X' },
		};

		funset(object, { name: { rule: { name: { rule: null } } } });

		expect(object).toEqual({ name: {} });
	});

	test('remove property "age" of property "age"', () => {
		const object = {
			age: [
				{
					age: 'X',
				},
			],
		};

		funset(object, { age: { rule: [{ age: null }] } });

		expect(object).toEqual({ age: [{}] });
	});

	test('remove property "age" of property "age"', () => {
		const object = {
			age: {
				age: 'X',
			},
		};

		funset(object, { age: { rule: [{ age: null }] } });

		expect(object).toEqual({ age: {} });
	});
});

describe('sets property', () => {
	test('defaults property "name"', () => {
		const object = {
			name: 'X',
		};

		funset(object, { name: { default: true, value: null } });

		expect(object).toEqual({ name: 'X' });
	});

	test('defaults property "name"', () => {
		const object = {};

		funset(object, { name: { default: true, value: 'X' } });

		expect(object).toEqual({ name: 'X' });
	});

	test('sets property "name"', () => {
		const object = {};

		funset(object, { name: { value: null } });

		expect(object).toEqual({ name: null });
	});

	test('sets property "date"', () => {
		const object = {};

		funset(object, { date: { value: new Date() } });

		expect(
			((object as Record<string, unknown>).date as Date).constructor
		).toEqual(new Date().constructor);
	});

	test('sets property "direct" in property "path"', () => {
		const object = {
			path: {
				direct: 'X',
			},
		};

		funset(object, { path: { direct: { value: null } } });

		expect(object).toEqual({
			path: { direct: null },
		});
	});
});

describe('arrays', () => {
	test('does mutate the object', () => {
		const object = {
			layer: ['123'],
		};

		funset(object, { layer: { rule: '123' } });

		expect(object).toEqual({ layer: ['123'] });
	});

	test('removes property "name" of property "layer"', () => {
		const object = {
			layer: [
				{
					name: 'X',
				},
			],
		};

		funset(object, { layer: { rule: { name: null } } });

		expect(object).toEqual({ layer: [{}] });
	});

	test('removes property "name" of property "layer"', () => {
		const object = {
			layer: [
				[
					{
						name: 'X',
					},
				],
			],
		};

		funset(object, { layer: { rule: { name: null } } });

		expect(object).toEqual({ layer: [[{}]] });
	});
});

describe('flags', () => {
	describe('deep', () => {
		test('removes all occurrences of property "name"', () => {
			const object = {
				name: 'X',
				path: {
					name: 'X',
				},
				layer: [
					[
						{
							name: 'X',
							layer: {
								name: '',
							},
						},
					],
				],
			};

			funset(object, { name: { deep: true, rule: null } });

			expect(object).toEqual({ path: {}, layer: [[{ layer: {} }]] });
		});

		describe('object in array', () => {
			test('removes all occurrences of property "somevalue" of property "layer"', () => {
				const array: Array<Record<string, unknown>> = [
					{
						name: 'X',
						path: {
							name: 'X',
						},
						layer: [
							[
								{
									name: 'X',
									layer: {
										name: '',
									},
								},
							],
						],
					},
				];

				funset(array, { name: { deep: true, rule: null } });

				expect(array).toEqual([{ path: {}, layer: [[{ layer: {} }]] }]);
			});
		});
	});
	describe('flag combinations', () => {
		describe('deep, defaulted', () => {
			test('defaults property "name" in all occurrences of property "name"', () => {
				const object = {
					path: {
						name: 'X',
					},
					layer: [
						[
							{
								name: 'X',
								layer: {},
							},
						],
					],
				};

				funset(object, {
					name: { deep: true, default: true, value: null },
				});

				expect(object).toEqual({
					path: { name: 'X' },
					name: null,
					layer: [[{ layer: { name: null }, name: 'X' }]],
				});
			});
		});
	});
});

describe('equalling property key and modifier key', () => {
	test('sets property "value" in property "path"', () => {
		const object = {
			path: {
				value: 'X',
			},
		};

		funset(object, { path: { value: { value: { a: 'b' } } } });

		expect(object).toEqual({
			path: { value: { a: 'b' } },
		});
	});

	test('removes property "rule" of property "path"', () => {
		const object = {
			path: {
				rule: 'X',
			},
		};

		funset(object, { path: { direct: true, rule: null } });

		expect(object).toEqual({
			path: {},
		});
	});

	test('sets property "rule" of property "path"', () => {
		const object = {
			path: {
				rule: 'X',
			},
		};

		funset(object, { path: { direct: true, rule: { value: null } } });

		expect(object).toEqual({
			path: { rule: null },
		});
	});

	test('sets property "value" in property "path"', () => {
		const object = {
			path: {
				value: 'X',
			},
		};

		funset(object, { path: { value: { value: null } } });

		expect(object).toEqual({
			path: { value: null },
		});
	});

	test('removes properties "value" and "value2" of property "path"', () => {
		const object = {
			path: {
				value: 'X',
				value2: 'X',
			},
		};

		funset(object, { path: { direct: true, value: null, value2: null } });

		expect(object).toEqual({
			path: {},
		});
	});

	test('removes property "direct" of property "path"', () => {
		const object = {
			path: {
				direct: 'X',
			},
		};

		funset(object, { path: { direct: null } });

		expect(object).toEqual({
			path: {},
		});
	});

	test('sets property "value"', () => {
		const object = {
			value: 5,
		};

		funset(object, { value: { value: 5 } });

		expect(object).toEqual({
			value: 5,
		});
	});

	test('removes property "direct" and sets property "value"', () => {
		const object = {
			path: {
				direct: 'X',
				value: 3,
			},
		};

		funset(object, {
			path: { rule: { direct: null, value: { value: null } } },
		});

		expect(object).toEqual({
			path: {
				value: null,
			},
		});
	});

	test('removes properties "direct", "value" and rule of property "path"', () => {
		const object = {
			path: {
				direct: 'X',
				rule: 1,
				value: 3,
			},
		};

		funset(object, {
			path: { rule: { direct: null, value: null, rule: null } },
		});

		expect(object).toEqual({
			path: {},
		});
	});

	test('removes properties "direct", "value" and "rule"', () => {
		const object = {
			direct: 'X',
			rule: 1,
			value: 3,
		};

		funset(object, {
			direct: null,
			value: null,
			rule: null,
		});

		expect(object).toEqual({});
	});
});

describe('unknown input object structure', () => {
	test('removes property "prop" of property "prop"', () => {
		const object = {};

		funset(object, { prop: { prop: null } });

		expect(object).toEqual({});
	});

	test('sets property "prop" at property "prop"', () => {
		const object = {};

		funset(object, { prop: { prop: { value: null } } });

		expect(object).toEqual({ prop: { prop: null } });
	});

	test('sets property "prop" at property "prop" with a rule', () => {
		const object = {};

		funset(object, { prop: { rule: { prop: { value: null } } } });

		expect(object).toEqual({ prop: { prop: null } });
	});

	test('sets property "prop" at property "prop" with an array of rules', () => {
		const object = {};

		funset(object, { prop: { rule: [{ prop: { value: null } }] } });

		expect(object).toEqual({ prop: { prop: null } });
	});

	test('sets property "prop" at property "prop" with the "direct" flag', () => {
		const object = {};

		funset(object, { prop: { direct: true, value: { value: null } } });

		expect(object).toEqual({ prop: { value: null } });
	});

	test('sets property "rule" at property "prop" with the "direct" flag', () => {
		const object = {};

		funset(object, { prop: { direct: true, rule: { value: null } } });

		expect(object).toEqual({ prop: { rule: null } });
	});

	test('sets property "rule" at property "prop" with the and "default" flag', () => {
		const object = {};

		funset(object, {
			prop: { prop: { default: true, value: null } },
		});

		expect(object).toEqual({ prop: { prop: null } });
	});

	test('sets property "rule" at property "prop" with the "direct" and "default" flag', () => {
		const object = {};

		funset(object, {
			prop: { default: true, direct: true, rule: { value: null } },
		});

		expect(object).toEqual({ prop: { rule: null } });
	});

	test('returns an empty object', () => {
		const object = {};

		funset(object, {
			prop: {
				prop: {
					prop: { prop: null, prop2: null },
					prop2: { prop3: { prop4: null } },
				},
			},
		});

		expect(object).toEqual({});
	});

	test('sets deeply nested properties "prop" and "prop5"', () => {
		const object = {};

		funset(object, {
			prop: {
				prop: {
					prop: { prop: { value: null }, prop2: null },
					prop2: { prop3: { prop4: null, prop5: { value: null } } },
				},
			},
		});

		expect(object).toEqual({
			prop: {
				prop: { prop2: { prop3: { prop5: null } }, prop: { prop: null } },
			},
		});
	});

	test('does absolutely nothing', () => {
		const object = {};

		funset(object, {});

		expect(object).toEqual({});
	});
});
