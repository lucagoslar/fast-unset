/*
 * Note: Tests can be found at src/__tests__/merge.spec.ts.
 */

export function merge(
	first: Record<string, unknown>,
	second: Record<string, unknown>
) {
	const cursor = first;

	const keys = Object.keys(second);
	const keyslength = keys.length;
	let keysindex = 0;

	while (keysindex < keyslength) {
		const key: keyof Record<string, unknown> = keys[keysindex];
		const value = second[key] as Record<string, unknown>;

		if (key in first) {
			if (Array.isArray(cursor[key]) && Array.isArray(value)) {
				cursor[key] = [...(cursor[key] as Array<unknown>), ...value];
			} else merge(first[key] as Record<string, unknown>, value);
		} else {
			cursor[key] = value;
		}
		keysindex++;
	}

	return first;
}
