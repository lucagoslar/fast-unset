import funset from '@src/index';

describe('usage', () => {
	describe('deep', () => {
		test('removes all occurrences of property "prop"', () => {
			const object = {
				prop: 'somevalue',
				nested: { prop: 'somevalue' },
				array: [{ prop: 'somevalue' }],
			};

			funset(object, { prop: { deep: true, rule: null } });

			expect(object).toEqual({ nested: {}, array: [{}] });
		});
	});

	describe('default', () => {
		test('defaults property "prop" to null', () => {
			const object = {
				prop: 'somevalue',
			};

			funset(object, { prop: { default: true, value: null } });

			expect(object).toEqual({ prop: 'somevalue' });
		});

		test('defaults property "prop" to null', () => {
			const object = {};

			funset(object, { prop: { default: true, value: null } });

			expect(object).toEqual({ prop: null });
		});
	});

	describe('direct', () => {
		test('removes property "value" of property "prop"', () => {
			const object = {
				prop: {
					value: null,
				},
			};

			funset(object, { prop: { direct: true, value: null } });

			expect(object).toEqual({ prop: {} });
		});

		test('removes property "value" of property "prop"', () => {
			const object = {
				prop: {
					value: null,
				},
			};

			funset(object, { prop: { rule: { value: null } } });

			expect(object).toEqual({ prop: {} });
		});
	});
});

describe('deleting properties', () => {
	test('removes property "nestedprop" of property "prop"', () => {
		const object = {
			prop: {
				nestedprop: null,
			},
		};

		funset(object, { prop: { nestedprop: null } });

		expect(object).toEqual({ prop: {} });
	});

	test('removes property "nestedprop" of property "prop"', () => {
		const object = {
			prop: {
				nestedprop: null,
			},
		};

		funset(object, {
			prop: { rule: { nestedprop: { rule: null } } },
		});

		expect(object).toEqual({ prop: {} });
	});
});

describe('setting values', () => {
	describe('set', () => {
		test('sets property "prop"', () => {
			const object: Record<string, unknown> = {};

			funset(object, {
				prop: { value: new Date() },
			});

			expect((object.prop as Date).constructor).toEqual(new Date().constructor);
		});
	});
});

describe('known limitattions', () => {
	describe('special cases', () => {
		describe('generic', () => {
			test('removes properties "value", "rule" and "direct"', () => {
				const object = { value: 1, rule: 1, direct: 1 };

				funset(object, { value: null, rule: null, direct: null });

				expect(object).toEqual({});
			});

			test('removes properties "value", "rule", "direct" of property "prop"', () => {
				const object = {
					prop: { value: 1, rule: 1, direct: 1 },
				};

				funset(object, {
					prop: {
						rule: { value: null, rule: null, direct: null },
					},
				});

				expect(object).toEqual({ prop: {} });
			});
		});

		describe('array', () => {
			test('removes property "prop" of property "value"', () => {
				const object = { value: [[{ prop: 1 }]] };

				funset(object, { value: { rule: { prop: null } } });

				expect(object).toEqual({ value: [[{}]] });
			});
		});
	});
});

describe('example', () => {
	test('removes properties according to the passed modifier', () => {
		const object = {
			secret: 'shhh',
			morning: false,
			child: [
				[
					{
						morning: false,
						secret: 'shhh',
						child: {
							morning: false,
						},
					},
				],
			],
			nested: {
				pin: 1234,
				nested: {
					anothersecret: 'shh',
				},
			},
		};

		const filter = {
			secret: { deep: true, rule: null },

			child: { morning: { deep: true, rule: null } },

			nested: {
				rule: [
					{ pin: { value: null } },
					{ nested: { anothersecret: { rule: null } } },
				],
			},

			// nested: {
			// 	pin: { value: null },
			// 	nested: { anothersecret: null },
			// },
		};
		const settings = {
			clone: false,
		};

		funset(object, filter, settings);

		expect(object).toEqual({
			morning: false,
			child: [
				[
					{
						child: {},
					},
				],
			],
			nested: {
				pin: null,
				nested: {},
			},
		});
	});
});
