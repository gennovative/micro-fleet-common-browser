"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Translatable_1 = require("./models/Translatable");
const v = require("./validators/validate-decorator");
exports.decorators = {
    array: v.array,
    bigInt: v.bigInt,
    boolean: v.boolean,
    datetime: v.datetime,
    defaultAs: v.defaultAs,
    id: v.id,
    number: v.number,
    only: v.only,
    required: v.required,
    string: v.string,
    validateClass: v.validateClass,
    validateProp: v.validateProp,
    translatable: Translatable_1.translatable,
};
//# sourceMappingURL=decorators.js.map