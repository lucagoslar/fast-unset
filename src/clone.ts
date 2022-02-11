/*
 * Note: Tests can be found at src/__tests__/clone.spec.ts.
 */

export function clone(value: unknown): unknown {
	if (Array.isArray(value)) {
		const tmp = [];

		const value_length = value.length;
		let value_index = 0;

		while (value_index < value_length) {
			tmp.push(clone(value[value_index]));
			value_index++;
		}

		return tmp;
	} else if (typeof value === 'function') {
		return value.bind({});
	} else if (
		value &&
		'object' === typeof value &&
		value.constructor === Object
	) {
		const tmp: Record<string, unknown> = {};

		const value_keys = Object.keys(value);
		const value_length = value_keys.length;
		let value_index = 0;

		while (value_index < value_length) {
			tmp[value_keys[value_index]] = clone(
				(value as Record<string, unknown>)[value_keys[value_index]]
			);
			value_index++;
		}

		return tmp;
	} else if ((value as Date).constructor === Date) {
		return new Date((value as Date).getTime());
	} else if (value && typeof value === 'object') {
		// Case of Date, RegExp, etc.
		return value.constructor(JSON.parse(JSON.stringify(value)));
	} else return value;
}
