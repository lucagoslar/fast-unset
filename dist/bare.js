"use strict";
/*
 * Note: Tests can be found at src/__tests__/index.spec.ts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bare = void 0;
/// <reference types="../types" />
function bare(object, options) {
    // Check if options is Array
    if (Array.isArray(options))
        destructureOptionArray(object, options);
    // Check if options is Array
    else if (Array.isArray(object))
        destructureObjectArray(object, options);
    // Otherwise proceed as usual (Only objects are supposed to being passed)
    else {
        const optionsKeys = Object.keys(options);
        const optionsKeysLength = optionsKeys.length;
        let optionsKeysIndex;
        // Loop through key value pairs
        for (optionsKeysIndex = 0; optionsKeysIndex < optionsKeysLength; optionsKeysIndex++) {
            const keyOpt = optionsKeys[optionsKeysIndex];
            const valueOpt = options[optionsKeys[optionsKeysIndex]];
            // Check if value is object and might have further complexity
            if (typeof valueOpt == 'object' &&
                valueOpt &&
                valueOpt.constructor === Object) {
                // Check value and rules
                const valueOfValueOpt = valueOpt.value;
                const ruleOfValueOpt = valueOpt
                    .rule;
                const directOfValueOpt = valueOpt.direct === true;
                const valueOfValueOptDefined = 'value' in valueOpt;
                const ruleOfValueOptDefined = 'rule' in valueOpt;
                // Catch a direct path to a value
                if ((!ruleOfValueOptDefined && !valueOfValueOptDefined) ||
                    directOfValueOpt) {
                    if ('direct' in valueOpt && directOfValueOpt) {
                        delete valueOpt.direct;
                    }
                    const valueOptKeys = Object.keys(valueOpt);
                    const valueOptKeysLength = valueOptKeys.length;
                    if (valueOptKeysLength === 1) {
                        bare(object[keyOpt], valueOpt);
                    }
                    else {
                        let valueOptKeysIndex;
                        // Loop through key value pairs
                        for (valueOptKeysIndex = 0; valueOptKeysIndex < valueOptKeysLength; valueOptKeysIndex++) {
                            const tmp = {};
                            tmp[valueOptKeys[valueOptKeysIndex]] = valueOpt[valueOptKeys[valueOptKeysIndex]];
                            bare(object[keyOpt], tmp);
                        }
                    }
                }
                else {
                    const flagDeep = valueOpt.deep === true; // Applies the rules in value to all nested objects for key
                    const flagDefault = valueOpt.default === true; // Set value of key value if no value was set for key in object
                    // Check if key is to be set
                    if ((flagDefault && !object[keyOpt]) ||
                        (valueOfValueOptDefined && !flagDefault)) {
                        object[keyOpt] = valueOfValueOpt;
                    }
                    // Check if one should remove key
                    else if (ruleOfValueOpt === null && !valueOfValueOptDefined) {
                        delete object[keyOpt];
                    }
                    // Check for a nested rule
                    else if (ruleOfValueOpt &&
                        typeof ruleOfValueOpt === 'object' &&
                        ruleOfValueOpt.constructor === Object) {
                        bare(object[keyOpt], ruleOfValueOpt);
                    }
                    // Check for nested rules in a array
                    else if (Array.isArray(ruleOfValueOpt)) {
                        bare(object[keyOpt], ruleOfValueOpt);
                    }
                    if (flagDeep) {
                        // Pass only necessary property value pair
                        const tmp = {};
                        tmp[keyOpt] = valueOpt;
                        deep(object, tmp);
                    }
                }
                // * End of processing object
            }
            else if (valueOpt === null) {
                // Remove key if it was just set to null
                delete object[keyOpt];
            }
        }
    }
}
exports.bare = bare;
// Handle value type checking for applying rules recursive
function deep(object, options) {
    const objectKeys = Object.keys(object);
    const objectKeysLength = objectKeys.length;
    let keyObj = objectKeys[0];
    let valueObj = object[keyObj];
    if (objectKeysLength === 1) {
        // Boost performance
        if (isObjectOrArray(valueObj)) {
            bare(valueObj, options);
        }
    }
    else {
        let objectKeysIndex;
        for (objectKeysIndex = 0; objectKeysIndex < objectKeysLength; objectKeysIndex++) {
            keyObj = objectKeys[objectKeysIndex];
            valueObj = object[keyObj];
            if (isObjectOrArray(valueObj)) {
                bare(valueObj, options);
            }
        }
    }
}
// Check if value is either an array or an object
function isObjectOrArray(value) {
    return (Array.isArray(value) ||
        (typeof value == 'object' && value && value.constructor === Object));
}
// Will be called if arg options is passed as an Array
function destructureOptionArray(object, options) {
    // Loop through options
    const optionsKeys = Object.keys(options);
    const optionsKeysLength = optionsKeys.length;
    if (optionsKeysLength === 1) {
        // Boost performance
        bare(object, options[0]);
    }
    else {
        let optionsKeysIndex;
        for (optionsKeysIndex = 0; optionsKeysIndex < optionsKeysLength; optionsKeysIndex++) {
            bare(object, options[optionsKeysIndex]);
        }
    }
}
// Will be called if arg options is passed as an Array
function destructureObjectArray(object, options) {
    // Loop through object
    const objectKeys = Object.keys(object);
    const objectKeysLength = objectKeys.length;
    if (objectKeysLength === 1) {
        // Boost performance
        bare(object[0], options);
    }
    else {
        let objectKeysIndex;
        for (objectKeysIndex = 0; objectKeysIndex < objectKeysLength; objectKeysIndex++) {
            bare(object[objectKeysIndex], options);
        }
    }
}
//# sourceMappingURL=bare.js.map