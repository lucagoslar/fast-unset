"use strict";
/*
 * Note: Tests can be found at src/__tests__/clone.spec.ts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
function clone(value) {
    if (Array.isArray(value)) {
        const tmp = [];
        const value_length = value.length;
        let value_index;
        for (value_index = 0; value_index < value_length; value_index++) {
            tmp.push(clone(value[value_index]));
        }
        return tmp;
    }
    else if (typeof value === 'function') {
        return value.bind({});
    }
    else if (value &&
        'object' === typeof value &&
        value.constructor === Object) {
        const tmp = {};
        const value_keys = Object.keys(value);
        const value_length = value_keys.length;
        let value_index;
        for (value_index = 0; value_index < value_length; value_index++) {
            tmp[value_keys[value_index]] = clone(value[value_keys[value_index]]);
        }
        return tmp;
    }
    else if (value.constructor === Date) {
        return new Date(value.getTime());
    }
    else if (value && typeof value === 'object') {
        // Case of Date, RegExp, etc.
        return value.constructor(JSON.parse(JSON.stringify(value)));
    }
    else
        return value;
}
exports.clone = clone;
//# sourceMappingURL=clone.js.map