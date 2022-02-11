/// <reference types="../types" />

import { resolver } from '@src/resolver';

export function core(input: Input, modifier: Modifier): Output {
	// Check if modifier is Array
	if (Array.isArray(modifier)) destructureOptionArray(input, modifier);
	// Check if modifier is Array
	else if (Array.isArray(input)) destructureInputArray(input, modifier);
	// Otherwise proceed as usual (Only inputs are supposed to get passed)
	else if (input) {
		const modifierKeys = Object.keys(modifier);
		const modifierKeysLength = modifierKeys.length;
		let modifierKeysIndex = 0;

		// Loop through key value pairs
		while (modifierKeysIndex < modifierKeysLength) {
			const keyOpt = modifierKeys[modifierKeysIndex] as keyof Modifier;
			const valueOpt = modifier[modifierKeys[modifierKeysIndex]];

			// Check if value is object and might have further complexity
			if (
				typeof valueOpt == 'object' &&
				valueOpt &&
				valueOpt.constructor === Object
			) {
				// Check value and rules
				const valueOfValueOpt = (valueOpt as Record<string, unknown>).value;
				const ruleOfValueOpt = (valueOpt as Record<string, unknown>)
					.rule as Record<string, unknown>;
				const directOfValueOpt =
					(valueOpt as Record<string, unknown>).direct === true;

				const valueOfValueOptDefined = 'value' in valueOpt;
				const ruleOfValueOptDefined = 'rule' in valueOpt;

				// Check if input contains property
				if (!input[keyOpt]) {
					const tmp: Record<string, unknown> = {};
					tmp[keyOpt] = valueOpt;
					const res = resolver(tmp);
					if (res && res[keyOpt]) {
						input[keyOpt] = res[keyOpt];
					}
				}

				// Catch a direct path to a value
				if (
					(!ruleOfValueOptDefined && !valueOfValueOptDefined) ||
					directOfValueOpt
				) {
					const valueOptKeys = Object.keys(valueOpt);
					const valueOptKeysLength = valueOptKeys.length;

					if (valueOptKeysLength === 1) {
						core(input[keyOpt] as Input, valueOpt as Record<string, unknown>);
					} else {
						let valueOptKeysIndex = 0;

						// Loop through key value pairs
						while (valueOptKeysIndex < valueOptKeysLength) {
							const tmp: Record<string, unknown> = {};
							tmp[valueOptKeys[valueOptKeysIndex]] = (
								valueOpt as Record<string, unknown>
							)[valueOptKeys[valueOptKeysIndex] as keyof Modifier];
							core(input[keyOpt] as Input, tmp);
							valueOptKeysIndex++;
						}
					}
				} else {
					const flagDeep = (valueOpt as Record<string, unknown>).deep === true; // Applies the rules in value to all nested objects for key
					const flagDefault =
						(valueOpt as Record<string, unknown>).default === true; // Set value of key value if no value was set for key in input

					// Check if key is to be set
					if (
						(flagDefault && !input[keyOpt]) ||
						(valueOfValueOptDefined && !flagDefault)
					) {
						input[keyOpt] = valueOfValueOpt;
					}
					// Check if one should remove key
					else if (ruleOfValueOpt === null && !valueOfValueOptDefined) {
						delete input[keyOpt];
					}
					// Check for a nested rule
					else if (
						ruleOfValueOpt &&
						typeof ruleOfValueOpt === 'object' &&
						ruleOfValueOpt.constructor === Object
					) {
						core(input[keyOpt] as Input, ruleOfValueOpt);
					}
					// Check for nested rules in a array
					else if (Array.isArray(ruleOfValueOpt)) {
						core(input[keyOpt] as Input, ruleOfValueOpt);
					}

					if (flagDeep) {
						// Pass only necessary property value pair
						const tmp: Record<string, unknown> = {};
						tmp[keyOpt] = valueOpt;
						deep(input, tmp);
					}
				}
				// * End of processing input
			} else if (valueOpt === null) {
				// Remove key if it was just set to null
				delete input[keyOpt];
			}
			modifierKeysIndex++;
		}
	}
	return input;
}

// Handle value type checking for applying rules recursive
function deep(input: Input, modifier: Modifier): void {
	const inputKeys = Object.keys(input);
	const inputKeysLength = inputKeys.length;
	let keyObj = inputKeys[0] as keyof Input;
	let valueObj = input[keyObj];

	if (inputKeysLength === 1) {
		// Boost performance
		if (isObjectOrArray(valueObj)) {
			core(valueObj as Record<string, unknown>, modifier);
		}
	} else {
		let inputKeysIndex = 0;
		while (inputKeysIndex < inputKeysLength) {
			keyObj = inputKeys[inputKeysIndex] as keyof Input;
			valueObj = input[keyObj];
			if (isObjectOrArray(valueObj)) {
				core(valueObj as Record<string, unknown>, modifier);
			}
			inputKeysIndex++;
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

// Will be called if arg modifier is passed as an Array
function destructureOptionArray(input: Input, modifier: Modifier): void {
	// Loop through modifier
	const modifierKeys = Object.keys(modifier);
	const modifierKeysLength = modifierKeys.length;

	if (modifierKeysLength === 1) {
		// Boost performance
		core(input, (modifier as Array<unknown>)[0] as Modifier);
	} else {
		let modifierKeysIndex = 0;
		while (modifierKeysIndex < modifierKeysLength) {
			core(input, (modifier as Array<unknown>)[modifierKeysIndex] as Modifier);
			modifierKeysIndex++;
		}
	}
}

// Will be called if arg modifier is passed as an Array
function destructureInputArray(input: Input, modifier: Modifier): void {
	// Loop through input
	const inputKeys = Object.keys(input);
	const inputKeysLength = inputKeys.length;

	if (inputKeysLength === 1) {
		// Boost performance
		core((input as Array<unknown>)[0] as Input, modifier);
	} else {
		let inputKeysIndex = 0;
		while (inputKeysIndex < inputKeysLength) {
			core((input as Array<unknown>)[inputKeysIndex] as Input, modifier);
			inputKeysIndex++;
		}
	}
}
