/*
 * Note: Tests can be found at src/__tests__/index.spec.ts.
 */

/// <reference types="../types" />

import { bare } from '@src/bare';
import { clone } from '@src/clone';

function funset(
	object: Record<string, unknown> | Array<Record<string, unknown>>,
	modifier: Record<string, unknown> | Array<Record<string, unknown>>,
	settings: Settings = {}
): Partial<typeof object> & Partial<typeof modifier> {
	if (
		(object.constructor !== Object && !Array.isArray(object)) ||
		(modifier.constructor !== Object && !Array.isArray(modifier)) ||
		settings.constructor !== Object
	) {
		throw new TypeError(
			'All passed arguments may only be of type object or type array of objects. Argument "settings" may only be of type object.'
		);
	}

	let ref = object;

	if (settings && settings.clone) {
		ref = clone(object) as typeof object;
	}

	bare(ref, modifier);

	return ref;
}

export default funset; // import syntax

module.exports = funset; // require syntax
