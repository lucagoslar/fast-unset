/*
 * Note: Tests can be found at src/__tests__/index.spec.ts.
 */

/// <reference types="../types" />

export function bare(object: GenericArg, options: GenericArg): void {
	// Check if options is Array
	if (Array.isArray(options)) destructureOptionArray(object, options);
	// Check if options is Array
	else if (Array.isArray(object)) destructureObjectArray(object, options);
	// Otherwise proceed as usual (Only objects are supposed to being passed)
	else {
		const optionsKeys = Object.keys(options);
		const optionsKeysLength = optionsKeys.length;
		let optionsKeysIndex: number;

		// Loop through key value pairs
		for (
			optionsKeysIndex = 0;
			optionsKeysIndex < optionsKeysLength;
			optionsKeysIndex++
		) {
			const keyOpt = optionsKeys[optionsKeysIndex] as keyof GenericArg;
			const valueOpt = options[optionsKeys[optionsKeysIndex]];

			// Check if value is object and might have further complexity
			if (
				typeof valueOpt == 'object' &&
				valueOpt &&
				valueOpt.constructor === Object
			) {
				// Check value and rules
				const valueOfValueOpt = (valueOpt as Record<string, unknown>).value;
				const ruleOfValueOpt = (valueOpt as Record<string, unknown>).rule as Record<
					string,
					unknown
				>;
				const directOfValueOpt =
					(valueOpt as Record<string, unknown>).direct === true;

				const valueOfValueOptDefined = 'value' in valueOpt;
				const ruleOfValueOptDefined = 'rule' in valueOpt;

				// Catch a direct path to a value
				if (
					(!ruleOfValueOptDefined && !valueOfValueOptDefined) ||
					directOfValueOpt
				) {
					if ('direct' in valueOpt && directOfValueOpt) {
						delete (valueOpt as Record<string, unknown>).direct;
					}
					const valueOptKeys = Object.keys(valueOpt);
					const valueOptKeysLength = valueOptKeys.length;

					if (valueOptKeysLength === 1) {
						bare(object[keyOpt] as GenericArg, valueOpt as Record<string, unknown>);
					} else {
						let valueOptKeysIndex: number;

						// Loop through key value pairs
						for (
							valueOptKeysIndex = 0;
							valueOptKeysIndex < valueOptKeysLength;
							valueOptKeysIndex++
						) {
							const tmp: GenericArg = {};
							tmp[valueOptKeys[valueOptKeysIndex]] = (
								valueOpt as Record<string, unknown>
							)[valueOptKeys[valueOptKeysIndex] as keyof GenericArg];
							bare(object[keyOpt] as GenericArg, tmp);
						}
					}
				} else {
					const flagDeep = (valueOpt as Record<string, unknown>).deep === true; // Applies the rules in value to all nested objects for key
					const flagDefault = (valueOpt as Record<string, unknown>).default === true; // Set value of key value if no value was set for key in object

					// Check if key is to be set
					if (
						(flagDefault && !object[keyOpt]) ||
						(valueOfValueOptDefined && !flagDefault)
					) {
						object[keyOpt] = valueOfValueOpt;
					}
					// Check if one should remove key
					else if (ruleOfValueOpt === null && !valueOfValueOptDefined) {
						delete object[keyOpt];
					}
					// Check for a nested rule
					else if (
						ruleOfValueOpt &&
						typeof ruleOfValueOpt === 'object' &&
						ruleOfValueOpt.constructor === Object
					) {
						bare(object[keyOpt] as GenericArg, ruleOfValueOpt);
					}
					// Check for nested rules in a array
					else if (Array.isArray(ruleOfValueOpt)) {
						bare(object[keyOpt] as GenericArg, ruleOfValueOpt);
					}

					if (flagDeep) {
						// Pass only necessary property value pair
						const tmp: Record<string, unknown> = {};
						tmp[keyOpt] = valueOpt;
						deep(object, tmp);
					}
				}
				// * End of processing object
			} else if (valueOpt === null) {
				// Remove key if it was just set to null
				delete object[keyOpt];
			}
		}
	}
}

// Handle value type checking for applying rules recursive
function deep(object: GenericArg, options: GenericArg): void {
	const objectKeys = Object.keys(object);
	const objectKeysLength = objectKeys.length;
	let keyObj = objectKeys[0] as keyof GenericArg;
	let valueObj = object[keyObj];

	if (objectKeysLength === 1) {
		// Boost performance
		if (isObjectOrArray(valueObj)) {
			bare(valueObj as Record<string, unknown>, options);
		}
	} else {
		let objectKeysIndex: number;
		for (
			objectKeysIndex = 0;
			objectKeysIndex < objectKeysLength;
			objectKeysIndex++
		) {
			keyObj = objectKeys[objectKeysIndex] as keyof GenericArg;
			valueObj = object[keyObj];
			if (isObjectOrArray(valueObj)) {
				bare(valueObj as Record<string, unknown>, options);
			}
		}
	}
}

// Check if value is either an array or an object
function isObjectOrArray(value: unknown): boolean | null {
	return (
		Array.isArray(value) ||
		(typeof value == 'object' && value && value.constructor === Object)
	);
}

// Will be called if arg options is passed as an Array
function destructureOptionArray(object: GenericArg, options: GenericArg): void {
	// Loop through options
	const optionsKeys = Object.keys(options);
	const optionsKeysLength = optionsKeys.length;

	if (optionsKeysLength === 1) {
		// Boost performance
		bare(object, (options as Array<unknown>)[0] as GenericArg);
	} else {
		let optionsKeysIndex;
		for (
			optionsKeysIndex = 0;
			optionsKeysIndex < optionsKeysLength;
			optionsKeysIndex++
		) {
			bare(object, (options as Array<unknown>)[optionsKeysIndex] as GenericArg);
		}
	}
}

// Will be called if arg options is passed as an Array
function destructureObjectArray(object: GenericArg, options: GenericArg): void {
	// Loop through object
	const objectKeys = Object.keys(object);
	const objectKeysLength = objectKeys.length;

	if (objectKeysLength === 1) {
		// Boost performance
		bare((object as Array<unknown>)[0] as GenericArg, options);
	} else {
		let objectKeysIndex;
		for (
			objectKeysIndex = 0;
			objectKeysIndex < objectKeysLength;
			objectKeysIndex++
		) {
			bare((object as Array<unknown>)[objectKeysIndex] as GenericArg, options);
		}
	}
}
