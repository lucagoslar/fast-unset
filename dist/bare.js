"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bare = void 0;
function bare(object, options) {
    if (Array.isArray(options))
        destructureOptionArray(object, options);
    else if (Array.isArray(object))
        destructureObjectArray(object, options);
    else {
        const optionsKeys = Object.keys(options);
        const optionsKeysLength = optionsKeys.length;
        let optionsKeysIndex;
        for (optionsKeysIndex = 0; optionsKeysIndex < optionsKeysLength; optionsKeysIndex++) {
            const keyOpt = optionsKeys[optionsKeysIndex];
            const valueOpt = options[optionsKeys[optionsKeysIndex]];
            if (typeof valueOpt == 'object' &&
                valueOpt &&
                valueOpt.constructor === Object) {
                const valueOfValueOpt = valueOpt.value;
                const ruleOfValueOpt = valueOpt
                    .rule;
                const directOfValueOpt = valueOpt.direct === true;
                const valueOfValueOptDefined = 'value' in valueOpt;
                const ruleOfValueOptDefined = 'rule' in valueOpt;
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
                        for (valueOptKeysIndex = 0; valueOptKeysIndex < valueOptKeysLength; valueOptKeysIndex++) {
                            const tmp = {};
                            tmp[valueOptKeys[valueOptKeysIndex]] = valueOpt[valueOptKeys[valueOptKeysIndex]];
                            bare(object[keyOpt], tmp);
                        }
                    }
                }
                else {
                    const flagDeep = valueOpt.deep === true;
                    const flagDefault = valueOpt.default === true;
                    if ((flagDefault && !object[keyOpt]) ||
                        (valueOfValueOptDefined && !flagDefault)) {
                        object[keyOpt] = valueOfValueOpt;
                    }
                    else if (ruleOfValueOpt === null && !valueOfValueOptDefined) {
                        delete object[keyOpt];
                    }
                    else if (ruleOfValueOpt &&
                        typeof ruleOfValueOpt === 'object' &&
                        ruleOfValueOpt.constructor === Object) {
                        bare(object[keyOpt], ruleOfValueOpt);
                    }
                    else if (Array.isArray(ruleOfValueOpt)) {
                        bare(object[keyOpt], ruleOfValueOpt);
                    }
                    if (flagDeep) {
                        const tmp = {};
                        tmp[keyOpt] = valueOpt;
                        deep(object, tmp);
                    }
                }
            }
            else if (valueOpt === null) {
                delete object[keyOpt];
            }
        }
    }
}
exports.bare = bare;
function deep(object, options) {
    const objectKeys = Object.keys(object);
    const objectKeysLength = objectKeys.length;
    let keyObj = objectKeys[0];
    let valueObj = object[keyObj];
    if (objectKeysLength === 1) {
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
function isObjectOrArray(value) {
    return (Array.isArray(value) ||
        (typeof value == 'object' && value && value.constructor === Object));
}
function destructureOptionArray(object, options) {
    const optionsKeys = Object.keys(options);
    const optionsKeysLength = optionsKeys.length;
    if (optionsKeysLength === 1) {
        bare(object, options[0]);
    }
    else {
        let optionsKeysIndex;
        for (optionsKeysIndex = 0; optionsKeysIndex < optionsKeysLength; optionsKeysIndex++) {
            bare(object, options[optionsKeysIndex]);
        }
    }
}
function destructureObjectArray(object, options) {
    const objectKeys = Object.keys(object);
    const objectKeysLength = objectKeys.length;
    if (objectKeysLength === 1) {
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