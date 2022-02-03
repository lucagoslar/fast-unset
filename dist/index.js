"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funset = void 0;
const bare_1 = require("./bare");
const clone_1 = require("./clone");
function funset(object, modifier, settings = {}) {
    if ((object.constructor !== Object && !Array.isArray(object)) ||
        (modifier.constructor !== Object && !Array.isArray(modifier)) ||
        settings.constructor !== Object) {
        throw new TypeError('All passed arguments may only be of type "Object".');
    }
    let ref = object;
    if (settings && settings.clone) {
        ref = (0, clone_1.clone)(object);
    }
    (0, bare_1.bare)(ref, modifier);
    return ref;
}
exports.funset = funset;
exports.default = funset;
//# sourceMappingURL=index.js.map